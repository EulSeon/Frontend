/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { styled, keyframes, css } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './swipeStyles.css';
import { leaveGameRoom, participateGameRoom } from '@apis/api/game';
import { socket } from 'socket';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { currentRoomCode, currentRound, roomSet } from '@states/roomSetting';
import { Beforeunload } from 'react-beforeunload';
import { defaultAlert, networkErrorAlert } from '@utils/customAlert';
import { finishBackgroundState } from '@states/backgroundState';
import { stockModalVals } from '@states/modalState';

interface Students {
  user_id: number;
  user_name: string;
  label: number;
  room_id: number;
  profile_num: number;
  ishost: number;
  session_id: string;
}

function Main_() {
  const navigate = useNavigate();
  const swiperRef = useRef();
  const profileSelectorRef = useRef<HTMLDivElement>(null);

  const resetFinishBackgroundState = useResetRecoilState(finishBackgroundState);
  const resetStockModalVals = useResetRecoilState(stockModalVals);
  const resetRoomSet = useResetRecoilState(roomSet);
  const resetCurrentRound = useResetRecoilState(currentRound);

  const [nameState, setNameState] = useState(false); // 현재 이름이 설정되어있는지 여부
  const [codeState, setCodeState] = useState(false); // 현재 코드가 설정되어있는지 여부
  const [pwCompare, setPwCompare] = useState<{
    text: string;
    state: boolean | undefined;
  }>({
    text: '프로필을 눌러 설정해주세요',
    state: undefined,
  }); // 패스워드 일치 여부
  const [toastMessageState, setToastMessageState] = useState(false); // 토스트 메시지 상태
  const [allowSlidePrev, setAllowSlidePrev] = useState(true); // 이전 슬라이드 넘어가기 가능 여부
  const [allowSlideNext, setAllowSlideNext] = useState(true); // 다음 슬라이드 넘어가기 가능 여부
  const [profileVisible, setProfileVisible] = useState(false); // ProfileSelector visible
  const [currentProfile, setCurrentProfile] = useState(0); // 현재 선택된 프로필

  const [name, setName] = useState(''); // 학생 이름
  const [roomCode, setRoomCode] = useState(''); // 방코드
  const [persistRoomCode, setPersistRoomCode] = useRecoilState(currentRoomCode); // 전역 변수 방코드
  const [students, setStudents] = useState<Students[]>([]); // 현재 접속한 학생들 목록

  // 이름 입력칸에서 엔터를 눌렀을 경우
  const handleOnNameKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      if (name.length === 0) {
        defaultAlert('이름을 입력하지 않았습니다.');
        return;
      }
      setNameState(true); // 이름 설정 완료 상태로 설정
      setCodeState(false);
    }
  };
  // 입장코드 입력칸에서 엔터를 눌렀을 경우
  const handleOnCodeKeyPress = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      if (roomCode.length === 0) {
        defaultAlert('입장 코드를 입력하지 않았습니다.');
        return;
      }
      setCodeState(true);
      setTimeout(async () => {
        // 일치하는 방을 찾고 유저를 해당 방에 참여시킴.
        const result = await participateGameRoom(roomCode, {
          name,
          profile_num: currentProfile,
        });
        if (result.status === 404) {
          // 코드가 불일치할 경우
          setCodeState(false);
          setPwCompare({
            text: '잘못된 입장코드 입니다.',
            state: false,
          });
          return;
        } else if (result.status === 500 || result.status === 503) {
          setCodeState(false);
          networkErrorAlert();
          return;
        }
        // 사용자가 성공적으로 게임방에 참여되었다면 참여자 리스트 업데이트
        setPersistRoomCode(roomCode);
        socket.emit('room_connect', roomCode); // 방 접속 이벤트
        setAllowSlideNext(true);
        setPwCompare({
          text: '패스워드가 일치합니다.',
          state: true,
        });
      }, 1000);
    }
  };
  // 방 나가기
  const leaveRoom = async () => {
    if (persistRoomCode) {
      const result = await leaveGameRoom(persistRoomCode);
      if (result.status !== 200) {
        console.error('오류 발생. 게임방에서 나가지 못했습니다.');
      }
      socket.emit('getParticipants', persistRoomCode);
    }
    // 전역변수 값들 초기화
    resetFinishBackgroundState();
    resetStockModalVals();
    resetRoomSet();
    resetCurrentRound();
  };

  // 소켓 동작
  useEffect(() => {
    socket.on('updateParticipants', (result: Students[] | string) => {
      if (result === 'start') {
        // 게임 시작일 경우
        navigate('wallet', {
          state: { roomPW: roomCode },
        });
      } else {
        setStudents(result as Students[]);
      }
    });

    return () => {
      socket.removeAllListeners('updateParticipants');
    };
  }, [pwCompare]);
  // 모바일 브라우저 네비게이션바 같은 것들 고려해서 추가
  useEffect(() => {
    const getScreenSize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', getScreenSize);
    return () => {
      window.removeEventListener('resize', getScreenSize);
    };
  }, []);
  // pw일치여부 바뀔때마다 확인해서 비교
  useEffect(() => {
    if (pwCompare.state === true) {
      setTimeout(() => {
        (swiperRef.current as any).slideNext();
      }, 2000);
    }
  }, [pwCompare.state]);
  // ProfileSelector 여닫이
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // Select layout을 제외한 부분을 클릭했을 경우 selected가 안 보이도록 설정
      if (
        !profileSelectorRef.current ||
        !profileSelectorRef.current.contains(e.target as Document)
      ) {
        setProfileVisible(false);
      }
    };
    document.addEventListener('click', handleOutsideClick, true);
    return () => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
  }, [profileSelectorRef]);
  // 새로고침의 경우를 위해 세션에 해당하는 유저 제거 + 세션 제거 + roomCode 초기화
  useEffect(() => {
    leaveRoom();
    setPersistRoomCode(undefined);

    return () => {
      socket.removeAllListeners();
    };
  }, []);
  useEffect(() => {
    socket.on('connectComplete', () => {
      // 소켓 connect가 완료된 후에 getParticipants 이벤트 emit
      socket.emit('getParticipants', persistRoomCode);
    });
  }, [persistRoomCode]);
  // 토스트 메시지 동작
  useEffect(() => {
    if (toastMessageState === true) {
      (swiperRef.current as any).slidePrev();
      setTimeout(async () => {
        setToastMessageState(false);
      }, 3000);
    }
  }, [toastMessageState]);

  return (
    <Beforeunload onBeforeunload={() => '새로고침하면 방에서 나가집니다.'}>
      <MainLayout>
        <Swiper
          onSwiper={(swiper: any) => {
            swiperRef.current = swiper;
          }}
          pagination={true}
          modules={[Pagination]}
          allowSlideNext={allowSlideNext}
          allowSlidePrev={allowSlidePrev}
          onSlideChange={() => {
            if ((swiperRef.current as any).activeIndex === 0) {
              // 첫 번째 슬라이드
              setAllowSlideNext(true);
            } else if ((swiperRef.current as any).activeIndex === 1) {
              // 두 번째 슬라이드
              setAllowSlideNext(false);
            } else if ((swiperRef.current as any).activeIndex === 2) {
              // 세 번째 슬라이드
              setAllowSlideNext(false);
              setAllowSlidePrev(false);
            }
          }}
        >
          <SwiperSlide>
            <FirstPage>
              <img src="/images/mainLogo.svg" />
              <p>
                학생들도 주식에 쉽게 다가갈 수 있는
                <br /> 모의주식 서비스 E - STOCK 입니다.
              </p>
            </FirstPage>
          </SwiperSlide>
          <SwiperSlide>
            <SecondPage $state={nameState} $codeVisible={nameState}>
              <SetMyInfo $nameState={nameState}>
                {currentProfile === 0 ? (
                  <div>
                    <img
                      src="/images/defaultProfile-blue1.png"
                      onClick={() => {
                        setProfileVisible(true);
                      }}
                    />
                    <img
                      src="/icons/modify-profile_icon.svg"
                      onClick={() => {
                        setProfileVisible(true);
                      }}
                    />
                  </div>
                ) : null}
                {currentProfile === 1 ? (
                  <div>
                    <img
                      src="/images/defaultProfile-blue2.png"
                      onClick={() => {
                        setProfileVisible(true);
                      }}
                    />
                    <img
                      src="/icons/modify-profile_icon.svg"
                      onClick={() => {
                        setProfileVisible(true);
                      }}
                    />
                  </div>
                ) : null}
                {currentProfile === 2 ? (
                  <div>
                    <img
                      src="/images/defaultProfile-blue3.png"
                      onClick={() => {
                        setProfileVisible(true);
                      }}
                    />
                    <img
                      src="/icons/modify-profile_icon.svg"
                      onClick={() => {
                        setProfileVisible(true);
                      }}
                    />
                  </div>
                ) : null}
                <NameForm
                  $nameState={nameState}
                  // onSubmit={handleOnNameKeyPress}
                >
                  <div>
                    <input
                      type="text"
                      placeholder="이름을 입력해주세요"
                      readOnly={nameState}
                      onKeyDown={handleOnNameKeyPress}
                      maxLength={5}
                      onClick={() => {
                        if (nameState) {
                          setNameState(false);
                        }
                      }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value);
                      }}
                    />
                    <img src="icons/edit_icon.svg" />
                  </div>

                  <button type="submit">테스트</button>
                </NameForm>
                <RoomCodeForm
                  $nameState={nameState}
                  $codeState={codeState}
                  // onSubmit={handleOnCodeKeyPress}
                >
                  <input
                    type="text"
                    placeholder="입장 코드를 입력하세요"
                    disabled={!nameState ? !codeState : codeState}
                    onKeyDown={handleOnCodeKeyPress}
                    maxLength={6}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRoomCode(e.target.value);
                    }}
                  />
                  <button type="submit">테스트</button>
                </RoomCodeForm>
              </SetMyInfo>

              <Notice $state={pwCompare.state}>{pwCompare.text}</Notice>

              <ProfileSelector
                ref={profileSelectorRef}
                $visible={profileVisible}
              >
                <SlidingDoor>
                  <span></span>
                </SlidingDoor>
                <Profiles>
                  <img
                    src="/images/defaultProfile-gray1.png"
                    onClick={() => {
                      setCurrentProfile(0);
                    }}
                  />
                  <img
                    src="/images/defaultProfile-gray2.png"
                    onClick={() => {
                      setCurrentProfile(1);
                    }}
                  />
                  <img
                    src="/images/defaultProfile-gray3.png"
                    onClick={() => {
                      setCurrentProfile(2);
                    }}
                  />
                </Profiles>
              </ProfileSelector>

              <ToastMessage $state={toastMessageState}>
                <p>방에서 나가졌습니다.</p>
              </ToastMessage>
            </SecondPage>
          </SwiperSlide>
          <SwiperSlide>
            <ThirdPage>
              <div
                onClick={() => {
                  // 방 나가는 기능도 추가
                  leaveRoom();
                  setPwCompare({
                    text: '프로필을 눌러 설정해주세요.',
                    state: undefined,
                  });
                  setPersistRoomCode(undefined);
                  setCodeState(false);
                  setAllowSlidePrev(true);
                  setToastMessageState(true);
                }}
              >
                <img src="icons/arrow-left-white_icon.svg" />
              </div>
              <StudentList>
                <List>
                  {students.map((student, index) => {
                    return (
                      <li key={index}>
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
                      </li>
                    );
                  })}
                </List>
              </StudentList>
              <p>곧 게임이 시작됩니다.</p>
            </ThirdPage>
          </SwiperSlide>
        </Swiper>
      </MainLayout>
    </Beforeunload>
  );
}

const profile_slide = (state: boolean) => keyframes`
  from {
    transform: ${state ? 'translateY(25px)' : 'translateY(0px)'};
  }
  to {
    transform: ${state ? 'translateY(0px)' : 'translateY(25px)'};
  }
`;
const name_slide = (state: boolean) => keyframes`
  from {
    transform: ${state ? 'translateY(40px)' : 'translateY(-20px)'};
    background: ${
      state ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0)'
    };
  }

  to {
    transform: ${state ? 'translateY(0px)' : 'translateY(20px)'};
    background: ${state ? 'rgba(255, 255, 255, 0)' : ''};
  }
`;
const roomcode_slide = (state: boolean) => keyframes`
  from {
    transform: ${state ? 'translateY(40px)' : 'translateY(-10px)'};
    background: ${
      state ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 1)'
    };
    opacity: ${state ? '0' : '1'};
  }
  to {
    transform: ${state ? 'translateY(-10px)' : 'translateY(40px)'};
    opacity: ${state ? '1' : '0'};
    // profile selector가 올라왔을 때 roomcode input 있는 부분이 클릭 안되는 오류가 있어서 추가
    display: ${state ? '' : 'none'}; 
  }
`;
const editIcon_slide = (state: boolean) => keyframes`
  from {
    transform: ${state ? 'translateY(40px)' : 'translateY(-20px)'};
  }

  to {
    transform: ${state ? 'translateY(0px)' : 'translateY(20px)'};
  }
`;

const MainLayout = styled.main`
  background: linear-gradient(
    108deg,
    #3f51b5 4.42%,
    #00bcd4 99.95%,
    #03a9f4 99.95%
  );
  position: relative;
  height: calc(var(--vh, 1vh) * 100);
  min-height: 600px; // 모바일에서 pagination 올라오는 거 방지
`;

const ToastMessage = styled.div<{ $state: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1d5190;
  width: 200px;
  height: 50px;
  position: absolute;
  bottom: 70px;
  border-radius: 30px;
  opacity: ${(props) => (props.$state ? '0.9' : '0')};
  transition: all 2s;

  & > p {
    color: #ffffff;
    font-size: 1.4rem;
  }
`;

const FirstPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  background: none;
  gap: 40px;

  & > img {
    max-width: 200px;
    min-width: 150px;
    width: 51%;
  }

  & > p {
    color: #ffffff;
    text-align: center;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const SecondPage = styled.div<{ $state: boolean; $codeVisible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  background: none;
  gap: 40px;
  position: relative;
`;

const SetMyInfo = styled.div<{
  $nameState: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 240px;
  background: none;
  gap: ${(props) => (props.$nameState ? '16px' : '36px')};
  position: relative;

  & > div {
    position: relative;
    animation: ${(props) => profile_slide(props.$nameState)} 1s 0s forwards;

    & > img:nth-child(1) {
      display: block;
      width: 100px;
      height: 100px;
      border-radius: 100px;
      cursor: pointer;
    }

    & > img:nth-child(2) {
      position: absolute;
      bottom: 0;
      right: 5px;
      cursor: pointer;
    }
  }
`;

const NameForm = styled.form<{
  $nameState: boolean;
}>`
  display: flex;
  justify-content: center;
  width: 100%;

  & > div {
    background: none;
    position: relative;
    width: 75%;
    max-width: 296px;

    & > input {
      width: 100%;
      display: block;
      border-radius: 100px;
      background: ${(props) =>
        props.$nameState ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'};
      padding: 16px 44px;
      color: ${(props) =>
        props.$nameState ? '#ffffff' : 'rgba(0, 0, 0, 0.5)'};
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      text-align: center;
      animation: ${(props) => name_slide(props.$nameState)} 1s 0s forwards;

      ::placeholder {
        color: rgba(0, 0, 0, 0.5);
      }

      &:focus {
        background-color: rgba(255, 255, 255, 0.4);
        color: #ffffff;
        -moz-transition: all, 1s;
        -o-transition: all, 1s;
        -webkit-transition: all, 1s;
        transition: all, 1s;

        &::placeholder {
          color: #ffffff;
        }
      }
    }

    // edit 아이콘
    & > img {
      position: absolute;
      top: 35%;
      right: 6vw;
      display: ${(props) => (props.$nameState ? 'block' : 'none')};
      animation: ${(props) => editIcon_slide(props.$nameState)} 1s 0s forwards;
    }
  }

  // submit 버튼
  & > button {
    display: none;
  }
`;

const RoomCodeForm = styled.form<{
  $nameState: boolean;
  $codeState: boolean;
}>`
  display: flex;
  justify-content: center;
  width: 100%;

  & > input {
    width: 75%;
    max-width: 296px;
    display: block;
    position: absolute;
    bottom: 0px;
    border-radius: 100px;
    background: ${(props) =>
      !props.$codeState ? '#ffffff' : 'rgba(255, 255, 255, 0)'};
    padding: 16px 44px;
    color: ${(props) => (!props.$codeState ? 'rgba(0, 0, 0, 0.5)' : '#ffffff')};
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    letter-spacing: ${(props) => (props.$codeState ? '7px' : '0px')};
    animation: ${(props) => roomcode_slide(props.$nameState)} 1s 0s forwards;

    ::placeholder {
      color: rgba(0, 0, 0, 0.5);
    }

    &:focus {
      background: rgba(255, 255, 255, 0.4);
      color: #ffffff;
      -moz-transition: all, 1s;
      -o-transition: all, 1s;
      -webkit-transition: all, 1s;
      transition: all, 1s;

      &::placeholder {
        color: #ffffff;
      }
    }
  }
  // submit 버튼
  & > button {
    display: none;
  }
`;

const shake = keyframes`
  0% {
    transform: translate3d(-2px, 0px, 0);
  }
  100% {
    transform: translate3d(2px, 0px, 0);
  }
`;

const Notice = styled.p<{ $state: boolean | undefined }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  position: absolute;
  bottom: 60px;
  height: 39px;
  width: 100%;
  background-color: ${(props) =>
    props.$state === false ? 'rgba(255, 0, 0, 0.3)' : 'none'};
  animation: ${(props) =>
    props.$state === false
      ? css`
          ${shake} 0.1s 0s 3
        `
      : ``};
`;

const ProfileSelector = styled.div<{ $visible: boolean }>`
  width: 100%;
  height: 240px;
  background-color: #ffffff;
  position: absolute;
  bottom: 0;
  border-radius: 16px 16px 0 0;
  transform: ${(props) =>
    props.$visible ? 'translateY(-0%)' : 'translateY(100%)'};
  transition: ${(props) =>
    props.$visible ? 'transform 0.6s ease-out' : 'transform 0.6s ease-in'};
  z-index: 1;
`;

const SlidingDoor = styled.div`
  height: 72.5px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.18);
  position: relative;
  display: flex;
  justify-content: center;

  & > span {
    display: inline-block;
    width: 134px;
    height: 5px;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 12px;
  }
`;

const Profiles = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 32px 16px 35px 16px;
  gap: 10px;
  overflow-x: auto;

  & > img {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }
`;

const ThirdPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 32px;
  position: relative;

  // 뒤로가기 아이콘
  & > div:nth-child(1) {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 12px;
    left: 12px;
  }

  & > p {
    color: #ffffff;
    font-size: 2.4rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 30px;
  }
`;

const StudentList = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 18px 21px;
  border-radius: 16px;
  width: 100%;
  height: 62.3%;
  background: rgba(255, 255, 255, 0.4);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  & li {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    gap: 24px;
    padding: 0 8px;
  }

  & img {
    width: 56px;
    height: 56px;
    border-radius: 100px;
  }
`;

export default Main_;
