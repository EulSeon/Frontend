import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { keyframes, styled } from 'styled-components';
import Header_ from '@components/common/header';
import ListLayout_ from '@components/listLayout';
import Select_ from '@components/select';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import {
  roomSet,
  currentBtnState,
  systemVisible,
  currentRound,
  currentRoomCode,
} from '../states/roomSetting';
import { goNextRound, saveGameResult, updateRoomInfo } from '@apis/api/game';
import convertSecondsToMinute from '@utils/convertSecondsToMinute';
import { socket } from 'socket';
import { defaultAlert, networkErrorAlert } from '@utils/customAlert';
import Swal from 'sweetalert2';
import 'animate.css';

interface Students {
  user_id: number;
  user_name: string;
  label: number;
  room_id: number;
  profile_num: number;
  ishost: number;
  session_id: string;
}

interface RoomSet {
  round_num: number;
  time_limit: number;
  seed: number;
}

interface RoundProps {
  currentRound: number;
  totalRound: number;
}

function WaitingRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pwRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useRecoilState(systemVisible); // 팝업창 visible
  const [currentBtn, setCurrentBtn] = useRecoilState(currentBtnState); // 현재 선택된 버튼
  const [students, setStudents] = useState<Students[]>([]); // 현재 접속한 학생들 목록
  const [roomSetting] = useRecoilState(roomSet); // 게임방 정보 세팅
  const [round, setRound] = useRecoilState(currentRound); // 현재 라운드
  const [timer, setTimer] = useState<{
    min: string | undefined;
    sec: string | undefined;
  }>({ min: undefined, sec: undefined }); // 타이머 시간
  const resetSystemVisible = useResetRecoilState(systemVisible);
  const [, setRoomCode] = useRecoilState(currentRoomCode); // 방코드

  useEffect(() => {
    if (!state || !state.roomPW) {
      console.error('게임방 패스워드가 존재하지 않습니다.');
      navigate('/', { replace: true });
    }
  }, []);

  if (!state || !state.roomPW) {
    return <></>;
  }

  // 게임방 정보 업데이트
  const updateRoomInformation = async () => {
    if (
      !roomSetting.round_num ||
      !roomSetting.time_limit ||
      !roomSetting.seed
    ) {
      defaultAlert('입력하지 않은 값이 있습니다');
      return;
    }
    if (students.length < 2) {
      defaultAlert('인원이 부족합니다');
      return;
    }
    const result = await updateRoomInfo(state.roomPW, roomSetting as RoomSet);
    if (result.status === 200) {
      // 방 정보가 성공적으로 업데이트 됐을 경우
      setVisible(true);
      setCurrentBtn('game');
      socket.emit('game_start', state.roomPW); // 게임 시작 이벤트
    } else if (result.status === 404) {
      networkErrorAlert('게임방이 존재하지 않습니다');
    } else if (result.status === 503) {
      networkErrorAlert();
    }
  };

  // 다음 라운드로 넘어가는 기능
  const _goNextRound = async () => {
    const result = await goNextRound(state.roomPW);
    if (result.status === 200) {
      resetSystemVisible();
      Swal.fire({
        position: 'center',
        title: `게임이 종료되었습니다.`,
        text: '게임 결과창으로 이동합니다.',
        imageUrl: '/images/errorImage.png',
        imageWidth: 200,
        imageHeight: 200,
        showConfirmButton: false,
        timer: 2300,
        width: 600,
        padding: '4em 0rem 4em',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
      setTimeout(async () => {
        navigate('/room/result', {
          state: { roomPW: state.roomPW },
          replace: true,
        });
      }, 2300);
      return;
    } else if (result.status === 500) {
      networkErrorAlert();
      return;
    }
    setCurrentBtn('game');
    setTimer({ min: undefined, sec: undefined });
    socket.emit('startTimer', state.roomPW);
  };

  useEffect(() => {
    socket.emit('room_connect', state.roomPW); // 방 접속 이벤트
    socket.on('connectComplete', () => {
      // 소켓 connect가 완료된 후에 getParticipants 이벤트 emit
      socket.emit('getParticipants', state.roomPW); // 참여자 목록 요청
    });
    socket.on('updateParticipants', (result: Students[] | string) => {
      if (result === 'start') {
        // 게임 시작일 경우
        return;
      } else {
        setStudents(result as Students[]);
      }
    });
    socket.on('timerStarted', () => {
      // 타이머 시작
      socket.emit('get_round', state.roomPW); // 라운드 요청 이벤트
    });
    socket.on('timerTick', (remainingTime: number) => {
      // 타이머 시간 가는 중 ...
      const { min, sec } = convertSecondsToMinute(remainingTime);
      setTimer({ min, sec });
    });
    socket.on('notify_round', ({ currentRound }: RoundProps) => {
      // 현재 라운드 받아오기
      setRound(currentRound);
    });
    socket.on('timerEnded', (currentRound: number) => {
      // 타이머가 끝났을 경우
      setCurrentBtn('gameover');
      _saveGameResult(currentRound);
    });

    return () => {
      socket.removeAllListeners('timerEnded');
      socket.emit('stopTimer', state.roomPW); // 타이머를 멈추는 이벤트
    };
  }, []);

  // 게임 결과 저장하기
  const _saveGameResult = async (currentRound: number) => {
    const result = await saveGameResult(state.roomPW, {
      round_num: currentRound,
    });
    if (result.status === 200) {
      return;
    } else {
      networkErrorAlert();
    }
  };

  const onClickBlackBackground = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      // 현재 클릭한 버튼이 패스워드일 경우에만, 바탕을 클릭했을 때 사라지도록 설정
      currentBtn === 'password' &&
      (!pwRef.current || !pwRef.current.contains(e.target as HTMLDivElement))
    ) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (state && state.roomPW) {
      setRoomCode(state.roomPW);
    }
  }, [state]);

  return (
    <WaitingRoomLayout>
      <BlackBackground $visible={visible} onClick={onClickBlackBackground}>
        {currentBtn === 'password' ? (
          <PassWord ref={pwRef}>
            <p>{state.roomPW}</p>
          </PassWord>
        ) : null}
        {currentBtn === 'game' ? (
          <GameInProgress>
            <img src="/icons/loading_icon.png" />
            <div>
              <p>{round}라운드</p>
              <p>
                {timer.min !== undefined && timer.sec !== undefined
                  ? timer.min + ':' + timer.sec
                  : '00:00'}
              </p>
            </div>
          </GameInProgress>
        ) : null}
        {currentBtn === 'gameover' ? (
          <GameOver>
            <p>라운드 종료</p>
            <OptionBox>
              <button
                onClick={() => {
                  navigate('/room/result', {
                    state: { roomPW: state.roomPW },
                  });
                }}
              >
                결과 조회
              </button>
              <button
                onClick={() => {
                  _goNextRound();
                }}
              >
                다음 라운드
              </button>
            </OptionBox>
          </GameOver>
        ) : null}
      </BlackBackground>

      <Header_ />
      <Main>
        <WaitingRoomList>
          <ListLayout_
            title="방 설정"
            src="/icons/room_icon.svg"
            buttonInfo={{
              button1: {
                value: 'PASSWORD',
                onClick: () => {
                  setVisible(true);
                  setCurrentBtn('password');
                },
              },
            }}
          >
            <SelectList>
              <Select_
                title={{ value: '라운드', visible: true }}
                set={{ start: 5, count: 6, standard: 1 }}
                defaultValue={
                  roomSetting.round_num
                    ? String(roomSetting.round_num)
                    : '라운드'
                }
              />
              <Select_
                title={{ value: '제한시간', visible: true }}
                set={{ start: 30, count: 20, standard: 30 }}
                defaultValue={
                  roomSetting.time_limit
                    ? String(
                        convertSecondsToMinute(roomSetting.time_limit).min +
                          ':' +
                          convertSecondsToMinute(roomSetting.time_limit).sec
                      )
                    : '~분 ~초'
                }
              />
              <Select_
                title={{ value: '시드머니', visible: true }}
                set={{ start: 100, count: 19, standard: 50 }}
                defaultValue={
                  roomSetting.seed
                    ? String(roomSetting.seed).substring(
                        0,
                        String(roomSetting.seed).length - 4
                      )
                    : '만원'
                }
              />
            </SelectList>
            <ListImage src="/images/roomsettingImage.svg" />
          </ListLayout_>
          <ListLayout_
            title="참여인원"
            src="/icons/participant_icon.svg"
            buttonInfo={{
              button1: {
                value: 'GAME START',
                onClick: () => {
                  updateRoomInformation();
                },
              },
            }}
          >
            <UserList>
              {students.map((student, index) => {
                return (
                  <UserProfile key={index}>
                    {student.profile_num === 0 ? (
                      <img src="/images/defaultProfile-blue1.png" />
                    ) : null}
                    {student.profile_num === 1 ? (
                      <img src="/images/defaultProfile-blue2.png" />
                    ) : null}
                    {student.profile_num === 2 ? (
                      <img src="/images/defaultProfile-blue3.png" />
                    ) : null}
                    <p>{student.user_name}</p>
                  </UserProfile>
                );
              })}
            </UserList>
            <ListImage2 src="/images/participantImage.svg" />
          </ListLayout_>
          <Buttons>
            <button
              onClick={() => {
                setVisible(true);
                setCurrentBtn('password');
              }}
            >
              PASSWORD
            </button>
            <button
              onClick={() => {
                updateRoomInformation();
              }}
            >
              GAME START
            </button>
          </Buttons>
        </WaitingRoomList>
      </Main>
    </WaitingRoomLayout>
  );
}

const WaitingRoomLayout = styled.main`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(120deg, #3f51b5, #00bbd4 100%);
  position: relative;
`;

const BlackBackground = styled.div<{ $visible: boolean }>`
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.36);
  position: absolute;
  z-index: 3;

  @media screen and (max-width: 768px) {
    position: fixed;
  }
`;

const PassWord = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 720px;
  height: 240px;
  border-radius: 24px;
  background: #ffffff;

  & > p {
    color: #000000;
    font-size: 6.4rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 51.2px; // 마지막 글자에도 간격 처리 됨.
    text-indent: 51.2px; // 따라서 들여쓰기 기능 추가
  }

  @media screen and (max-width: 768px) {
    width: 80%;
    height: auto;
    max-width: 400px;
    padding: 30px 0;

    & > p {
      letter-spacing: 20px;
      text-indent: 20px;
      font-size: 5vw;
    }
  }
`;

const rotatedImage = () => keyframes`
  100% {
    transform: rotate(-360deg);
  }
`;

const GameInProgress = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 720px;
  height: 320px;
  border-radius: 24px;
  background: #ffffff;
  gap: 64px;

  & > img {
    width: 79.492px;
    height: 79.492px;
    animation: ${rotatedImage} 1s infinite linear;
  }

  & > div {
    display: flex;
    gap: 80px;

    & > p {
      color: #000000;
      font-size: 4.8rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;

      &:nth-child(2) {
        width: 130px;
      }
    }
  }

  @media screen and (max-width: 768px) {
    height: auto;
    width: 80%;
    gap: 40px;
    padding: 40px 0;

    & > img {
      width: 50px;
      height: 50px;
    }

    & > div {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;

      & > p {
        font-size: 3rem;

        &:nth-child(2) {
          width: 80px;
        }
      }
    }
  }
`;

const GameOver = styled.div`
  display: flex;
  flex-direction: column;
  width: 720px;
  height: 320px;
  border-radius: 24px;
  background: #ffffff;
  overflow: hidden;

  & > p {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 242px;
    color: #000000;
    font-size: 4.8rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  @media screen and (max-width: 768px) {
    height: auto;
    width: 80%;

    & > p {
      height: unset;
      font-size: 6vw;
      padding: 50px 0;
    }
  }
`;

const OptionBox = styled.div`
  width: 100%;
  border-top: 2px solid #8c8c8c;
  height: 79px;
  background-color: #ffffff;

  & > button {
    background-color: #ffffff;
    height: 100%;
    width: 50%;
    color: #3f51b5;
    font-size: 3.2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    cursor: pointer;
    -moz-transition: all, 0.3s;
    -o-transition: all, 0.3s;
    -webkit-transition: all, 0.3s;
    transition: all, 0.3s;

    &:first-child {
      border-right: 2px solid #8c8c8c;
    }

    &:hover {
      background-color: #a7c2e4;
      color: #ffffff;
    }
  }

  @media screen and (max-width: 768px) {
    height: unset;

    & > button {
      font-size: 4vw;
      padding: 20px 0;
    }
  }
`;

const Main = styled.div`
  display: flex;
`;

const WaitingRoomList = styled.div`
  display: flex;
  width: 1280px;
  margin: 0 auto;
  padding: 0 25px;
  gap: 30px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 0;

    & > div:nth-child(1) {
      height: auto;
      min-height: unset;
      max-height: unset;
      padding-top: 50px;
      z-index: 2;

      & > div:nth-child(3) {
        display: none;
      }
    }

    & > div:nth-child(2) {
      height: 500px;
      min-height: unset;
      max-height: unset;

      & > div:nth-child(3) {
        display: none;
      }
    }
  }
`;

const Buttons = styled.div`
  display: none;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 20px;

  & > button {
    width: 100%;
    height: 50px;
    color: #ffffff;
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
    -moz-transition: background, 0.3s;
    -o-transition: background, 0.3s;
    -webkit-transition: background, 0.3s;
    transition: background, 0.3s;
    cursor: pointer;

    &:focus {
      background-color: #a7c2e4;
    }

    &:hover {
      border-radius: 25px;
      background: #a7c2e4;
      box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
    }
  }

  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

const SelectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 29px;
  position: absolute;
  left: 37px;
  top: 65px;
  z-index: 1;

  @media screen and (max-width: 768px) {
    position: static;
  }
`;

const ListImage = styled.img`
  align-self: center;
  position: absolute;
  bottom: 91px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-flow: wrap;
  gap: 22px 79px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const UserProfile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  z-index: 1;

  & > img {
    width: 56px;
    height: 56px;
    border-radius: 100px;
  }

  & > p {
    color: #ffffff;
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    white-space: nowrap;
  }

  @media screen and (max-width: 768px) {
    & > img {
      width: 40px;
      height: 40px;
    }

    & > p {
      font-size: 1.5rem;
    }
  }
`;

const ListImage2 = styled.img`
  align-self: center;
  position: absolute;
  bottom: 91px;
  opacity: 0.3;
  pointer-events: none;

  @media screen and (max-width: 768px) {
    width: 200px;
    bottom: 20px;
    right: 20px;
  }
`;

export default WaitingRoom;
