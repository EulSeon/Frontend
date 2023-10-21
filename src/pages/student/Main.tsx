/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { styled, keyframes } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './swipeStyles.css';
import { participateGameRoom } from '@apis/api/game';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:8000');

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

  const [nameState, setNameState] = useState(false); // 현재 이름이 설정되어있는지 여부
  const [codeState, setCodeState] = useState(false); // 현재 코드가 설정되어있는지 여부
  const [pwCompare, setPwCompare] = useState<{
    // 패스워드 일치 여부
    text: string;
    state: boolean | undefined;
  }>({
    text: '프로필을 눌러 설정해주세요',
    state: undefined,
  });
  const [allowSlidePrev, setAllowSlidePrev] = useState(true); // 이전 슬라이드 넘어가기 가능 여부
  const [allowSlideNext, setAllowSlideNext] = useState(true); // 다음 슬라이드 넘어가기 가능 여부
  const [profileVisible, setProfileVisible] = useState(false); // ProfileSelector visible
  const [currentProfile, setCurrentProfile] = useState(0); // 현재 선택된 프로필

  const [name, setName] = useState(''); // 학생 이름
  const [roomCode, setRoomCode] = useState(''); // 방코드
  const [students, setStudents] = useState<Students[] | []>([]); // 현재 접속한 학생들 목록

  // 이름 입력칸에서 엔터를 눌렀을 경우
  const handleOnNameKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      if (name.length === 0) {
        alert('이름을 입력하지 않았습니다.');
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
        alert('방코드를 입력하지 않았습니다.');
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
        } else if (result.status === 500) {
          setCodeState(false);
          alert('오류가 발생했습니다. 다시 시도해주세요.');
          return;
        }
        // 사용자가 성공적으로 게임방에 참여되었다면 참여자 리스트 업데이트
        socket.emit('room_connect', roomCode); // 방 접속 이벤트
        socket.emit('getParticipants', roomCode);
        setAllowSlideNext(true);
        setPwCompare({
          text: '패스워드가 일치합니다.',
          state: true,
        });
      }, 1000);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connection server');
    });
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
  }, [roomCode]);

  // 모바일 브라우저 네비게이션바 같은 것들 고려해서 추가
  const getScreenSize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  useEffect(() => {
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

  return (
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
                <img
                  src="/images/defaultProfile-blue1.svg"
                  onClick={() => {
                    setProfileVisible(true);
                  }}
                />
              ) : null}
              {currentProfile === 1 ? (
                <img
                  src="/images/defaultProfile-blue2.svg"
                  onClick={() => {
                    setProfileVisible(true);
                  }}
                />
              ) : null}
              {currentProfile === 2 ? (
                <img
                  src="/images/defaultProfile-blue3.svg"
                  onClick={() => {
                    setProfileVisible(true);
                  }}
                />
              ) : null}
              <NameForm
                $nameState={nameState}
                // onSubmit={handleOnNameKeyPress}
              >
                <input
                  type="text"
                  placeholder="이름을 입력해주세요"
                  readOnly={nameState}
                  onKeyDown={handleOnNameKeyPress}
                  onClick={() => {
                    if (nameState) {
                      setNameState(false);
                    }
                  }}
                  onChange={(e: any) => {
                    setName(e.target.value);
                  }}
                />
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
                  onChange={(e: any) => {
                    setRoomCode(e.target.value);
                  }}
                />
                <button type="submit">테스트</button>
              </RoomCodeForm>
            </SetMyInfo>

            <Notice $state={pwCompare.state}>{pwCompare.text}</Notice>

            <ProfileSelector ref={profileSelectorRef} $visible={profileVisible}>
              <SlidingDoor>
                <span></span>
              </SlidingDoor>
              <Profiles>
                <img
                  src="/images/defaultProfile-gray1.svg"
                  onClick={() => {
                    setCurrentProfile(0);
                  }}
                />
                <img
                  src="/images/defaultProfile-gray2.svg"
                  onClick={() => {
                    setCurrentProfile(1);
                  }}
                />
                <img
                  src="/images/defaultProfile-gray3.svg"
                  onClick={() => {
                    setCurrentProfile(2);
                  }}
                />
              </Profiles>
            </ProfileSelector>
          </SecondPage>
        </SwiperSlide>
        <SwiperSlide>
          <ThirdPage>
            <StudentList>
              <List>
                {students.map((student, index) => {
                  return (
                    <li key={index}>
                      {student.profile_num === 0 ? (
                        <img src="/images/defaultProfile-blue1.svg" />
                      ) : null}
                      {student.profile_num === 1 ? (
                        <img src="/images/defaultProfile-blue2.svg" />
                      ) : null}
                      {student.profile_num === 2 ? (
                        <img src="/images/defaultProfile-blue3.svg" />
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

  & > img {
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 100px;
    animation: ${(props) => profile_slide(props.$nameState)} 1s 0s forwards;
  }
`;

const NameForm = styled.form<{
  $nameState: boolean;
}>`
  display: flex;
  justify-content: center;
  width: 100%;

  & > input {
    width: 75%;
    max-width: 296px;
    display: block;
    border-radius: 100px;
    background: ${(props) =>
      props.$nameState ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'};
    padding: 16px 44px;
    color: ${(props) => (props.$nameState ? '#ffffff' : 'rgba(0, 0, 0, 0.5)')};
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
`;

const ThirdPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 32px;

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
