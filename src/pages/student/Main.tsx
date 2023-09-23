/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { styled, keyframes, css } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './swipeStyles.css';

function Main_() {
  const swiperRef = useRef();

  useEffect(() => {
    if (swiperRef && swiperRef.current) {
      console.log((swiperRef.current as any).activeIndex);
    }
  }, [swiperRef]);

  const [nameState, setNameState] = useState(false); // 현재 이름이 설정되어있는지 여부
  const [codeState, setCodeState] = useState(false); // 현재 코드가 설정되어있는지 여부
  const [pwCompare, setPwCompare] = useState<{
    text: string;
    state: boolean | undefined;
  }>({
    text: '프로필을 눌러 설정해주세요',
    state: undefined,
  });
  const [allowSlideNext, setAllowSlideNext] = useState(true);
  const [allowSlidePrev, setAllowSlidePrev] = useState(true);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      if (isRightSwipe) {
        setNameState(false); // 다시 이름 설정하는 상태로 넘어감.
        setCodeState(false);
      }
    }
  };

  // 이름 입력칸에서 엔터를 눌렀을 경우
  const handleOnNameKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      setNameState(true); // 이름 설정 완료 상태로 설정
      // setCodeVisible(true);
      setCodeState(false);
    }
  };

  // 입장코드 입력칸에서 엔터를 눌렀을 경우
  const handleOnCodeKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      setCodeState(true);
      // 아래 두 줄은 테스트를 위해 임시로 넣은 부분
      // setCodeState(true);
      // setPwCompare((pre) => ({ ...pre, state: false }));

      // api에서 받은 값의 결과값이 될 변수
      const compare = true; // let으로 바꿀거임

      if (!compare) {
        setCodeState(false);
        console.log('불일치');
        // 코드가 불일치할 경우
        setCodeState(false);
        setPwCompare({
          text: '잘못된 입장코드 입니다.',
          state: false,
        });
        return;
      }
      setAllowSlideNext(true);
      setPwCompare((pre) => ({
        ...pre,
        state: true,
      }));
    }
  };

  useEffect(() => {
    if (pwCompare.state === true) {
      setTimeout(() => {
        (swiperRef.current as any).slideNext();
      }, 1500);
    }
  }, [pwCompare.state]);

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
          if ((swiperRef.current as any).activeIndex === 1) {
            setAllowSlideNext(false);
            setAllowSlidePrev(false);
          } else if ((swiperRef.current as any).activeIndex === 2) {
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
        <SwiperSlide
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <SecondPage
            $state={nameState}
            $codeVisible={nameState}
            // $codeState={codeState}
          >
            <SetMyInfo
              $nameState={nameState}
              $codeVisible={nameState}
              $codeState={codeState}
            >
              <img src="/images/defaultProfile.svg" />
              <input
                type="text"
                placeholder="이름을 입력해주세요"
                disabled={nameState}
                onKeyDown={handleOnNameKeyPress}
              />

              <input
                type="text"
                placeholder="입장 코드를 입력하세요"
                // disabled={codeState}
                onKeyDown={handleOnCodeKeyPress}
              />
            </SetMyInfo>

            <Notice $state={pwCompare.state}>{pwCompare.text}</Notice>

            {/* <ProfileSelector>
              <SlidingDoor>
                <span></span>
              </SlidingDoor>
              <Profiles>
                <img src="/images/defaultProfile1.svg" />
                <img src="/images/defaultProfile2.svg" />
                <img src="/images/defaultProfile3.svg" />
              </Profiles>
            </ProfileSelector> */}
          </SecondPage>
        </SwiperSlide>
        <SwiperSlide>
          <ThirdPage>
            <StudentList>
              <List>
                {new Array(20).fill(0).map((_, index) => {
                  return (
                    <li key={index}>
                      <img src="/images/defaultProfile.svg" />
                      <p>2학년 4반 김유경</p>
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
const MainLayout = styled.main`
  background: linear-gradient(
    108deg,
    #3f51b5 4.42%,
    #00bcd4 99.95%,
    #03a9f4 99.95%
  );
  position: relative;
`;

const FirstPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: none;
  gap: 40px;

  & > img {
    width: 200px;
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

const SecondPage = styled.form<{ $state: boolean; $codeVisible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: none;
  gap: 40px;
  position: relative;
`;

const SetMyInfo = styled.div<{
  $nameState: boolean;
  $codeVisible: boolean;
  $codeState: boolean;
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
    width: 100px;
    height: 100px;
    border-radius: 100px;
    animation: ${(props) => slidein2(props.$nameState)} 1s 0s forwards;
  }

  & > input:nth-child(2) {
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
    animation: ${(props) => slideup(props.$nameState)} 1s 0s forwards;

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

  & > input:nth-child(3) {
    position: absolute;
    bottom: 0px;
    border-radius: 100px;
    background: ${(props) =>
      !props.$codeState ? '#ffffff' : 'rgba(255, 255, 255, 0)'};
    padding: 16px 44px;
    color: ${(props) =>
      props.$codeVisible ? 'rgba(0, 0, 0, 0.5)' : '#ffffff'};
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    letter-spacing: ${(props) => (props.$codeState ? '7px' : '0px')};
    animation: ${(props) =>
      props.$codeState
        ? css`
            ${final} 1s 0s forwards
          `
        : css`
            ${slidein3(props.$codeVisible)} 1s 0s forwards
          `};

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

const ProfileSelector = styled.div`
  width: 100%;
  height: 240px;
  background-color: #ffffff;
  position: absolute;
  bottom: 0;
  border-radius: 16px 16px 0 0;
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

const slideup = (state: boolean) => keyframes`
  from {
    transform: ${state ? 'translateY(40px)' : 'translateY(-40px)'};
    background: ${
      state ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0)'
    };
  }

  to {
    transform: ${state ? 'translateY(0px)' : 'translateY(20px)'};
    background: ${state ? 'rgba(255, 255, 255, 0)' : ''};
  }
`;

const slidein3 = (state: boolean) => keyframes`
  from {
    transform: ${state ? 'translateY(40px)' : 'translateY(-10px)'};
    background: ${
      state ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 1)'
    };
    opacity: ${state ? '0' : '1'};
  }
  to {
    transform: ${state ? 'translateY(-10px)' : 'translateY(40px)'};
    background: ${state ? '' : ''};
    opacity: ${state ? '1' : '0'};
  }
`;

const final = keyframes`
  from {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.4);
  }
  to {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0);
  }
`;

const slidein2 = (state: boolean) => keyframes`
  from {
    transform: ${state ? 'translateY(25px)' : 'translateY(0px)'};
  }

  to {
    transform: ${state ? 'translateY(0px)' : 'translateY(25px)'};
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
