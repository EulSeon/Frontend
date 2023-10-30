/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { css, keyframes, styled } from 'styled-components';
import StudentHeader from '@components/student/header';
import StudentLayout_ from '@components/student/layout';
import Wallet from '@components/student/wallet';
import Stock from '@components/student/stock';
import News from '@components/student/news';
import { useRecoilState } from 'recoil';
import { navbarState } from '@states/navbarState';
import { stockModalState, stockModalVals } from '@states/modalState';
import { finishBackgroundState } from '@states/backgroundState';
import { currentRoomCode, currentRound } from '@states/roomSetting';
import convertSecondsToMinute from '@utils/convertSecondsToMinute';
import { socket } from 'socket';

function Game() {
  const navigate = useNavigate();
  const [selectedNav] = useRecoilState(navbarState);
  const [modalState, setModalState] = useRecoilState(stockModalState); // 모달 visible 상태
  const [modalVals] = useRecoilState(stockModalVals); // 모달에 들어가는 값
  const [finish, setFinish] = useRecoilState(finishBackgroundState); // 라운드 종료 여부
  const [round, setRound] = useRecoilState(currentRound); // 현재 라운드
  const popupRef = useRef<any>(null);
  const [timer, setTimer] = useState<{
    min: string | undefined;
    sec: string | undefined;
  }>({ min: undefined, sec: undefined }); // 타이머 시간
  const [roomCode] = useRecoilState(currentRoomCode); // 전역 변수 방코드

  useEffect(() => {
    socket.emit('room_connect', roomCode); // 방 접속 이벤트
    socket.on('timerStarted', () => {
      // 타이머 시작되면 라운드 시작
      setFinish(false);
    });
    socket.on('timerTick', (info: any) => {
      // 타이머 시간 가는 중 ...
      const { min, sec } = convertSecondsToMinute(info);
      setTimer({ min, sec });
    });
    socket.on('timerEnded', () => {
      setTimer({ min: undefined, sec: undefined });
      // 타이머가 끝나면 해당 라운드 종료
      setFinish(true);
      // 라운드가 종료될 때 모달창이 열려있는 상태였다면 모달창 닫아주기
      setModalState((pre) => ({
        ...pre,
        visible: false,
      }));
    });
    socket.on('notify_round', (round: number) => {
      // 현재 라운드 받아오기
      setRound(round);
    });
  }, []);

  const onClickBlackBackground = (e: any) => {
    if (!popupRef.current || !popupRef.current.contains(e.target)) {
      setModalState((pre) => ({
        ...pre,
        visible: false,
      }));
    }
  };

  // (모달창 열린 후 or 라운드가 끝난 화면이 나올 경우) 배경 스크롤 불가능하도록 설정
  useEffect(() => {
    if (modalState.visible || finish) {
      document.body.style.cssText = `
          position: fixed;
          top: -${window.scrollY}px;
          overflow-y: scroll;
          width: 100%;`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
  }, [modalState.visible, finish]);

  return (
    <StudentLayout_>
      <FinishBackground $visible={finish}>
        <div>
          <img src="/icons/loading_icon.png" />
          <p>{round}라운드 종료</p>
        </div>
      </FinishBackground>
      <BlackBackground
        $visible={modalState.visible}
        onClick={onClickBlackBackground}
      ></BlackBackground>
      <StudentHeader navbar />
      <Main $state={modalState.buttonState}>
        <ContentSection>
          {selectedNav === 'wallet' ? <Wallet /> : null}
          {selectedNav === 'stock' ? <Stock /> : null}
          {selectedNav === 'news' ? <News /> : null}
        </ContentSection>
        <Round>
          <p>{round} / 5 라운드</p>
          <p>
            {timer.min !== undefined && timer.sec !== undefined
              ? timer.min + ':' + timer.sec
              : '00:00'}
          </p>
        </Round>
      </Main>

      <PopUP $visible={modalState.visible} ref={popupRef}>
        <span></span>
        <div>
          <h2>{modalVals.company_name}</h2>
          {modalVals.kind === 'wallet' ? (
            <h2>{modalVals.inStock}주 보유</h2>
          ) : null}
        </div>
        <Price>
          <div>
            <p>
              {modalVals.kind === 'wallet' ? '평균 매입가' : '전 라운드 가격'}
            </p>
            <p>
              {modalVals.difference === 0
                ? '-'
                : modalVals.first_menu_price.toLocaleString('ko-KR')}
            </p>
          </div>
          <div>
            <p>현 라운드 가격</p>
            <p>{modalVals.second_menu_price.toLocaleString('ko-KR')}</p>
          </div>
        </Price>
        <PopUP_Notice>{modalVals.info}</PopUP_Notice>
        {selectedNav === 'wallet' ? (
          <PopUP_Button>
            <button
              onClick={() => {
                setModalState({
                  buttonState: 'buy',
                  visible: false,
                });
                setTimeout(() => {
                  navigate('/student/buy');
                }, 500);
              }}
            >
              추가매수
            </button>
            <button
              onClick={() => {
                setModalState({
                  buttonState: 'sell',
                  visible: false,
                });
                setTimeout(() => {
                  navigate('/student/sell');
                }, 500);
              }}
            >
              매도하기
            </button>
          </PopUP_Button>
        ) : null}
        {selectedNav === 'stock' ? (
          <PopUP_Button>
            <button
              onClick={() => {
                setModalState({
                  buttonState: 'buy',
                  visible: false,
                });
                setTimeout(() => {
                  navigate('/student/buy');
                }, 500);
              }}
            >
              매수하기
            </button>
          </PopUP_Button>
        ) : null}
      </PopUP>
    </StudentLayout_>
  );
}

const rotatedImage = () => keyframes`
  100% {
    transform: rotate(-360deg);
  }
`;

const FinishBackground = styled.div<{ $visible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  bottom: 0;
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  font-size: 1.5rem;
  z-index: 5;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 281px;
    height: 159px;
    background: #ffffff;
    border-radius: 24px;
    gap: 10px;

    & > img {
      width: 79.492px;
      height: 79.492px;
      animation: ${rotatedImage} 1s infinite linear;
    }

    & > p {
      color: #000000;
      font-size: 1.8rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
`;

const BlackBackground = styled.div<{ $visible: boolean }>`
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.36);
  position: absolute;
  z-index: 1;
  overflow: hidden;
`;

const content_slide = (state: string | undefined | null) => keyframes`
  from {
    transform: ${state !== null ? 'translateY(0px)' : 'translateY(300px)'};
    opacity: ${state !== null ? 1 : 0};
  }

  to {
    transform: ${state !== null ? 'translateY(300px)' : 'translateY(0px)'};
    opacity: ${state !== null ? 0 : 1};
  }
`;

const Main = styled.main<{ $state: string | undefined | null }>`
  display: flex;
  flex-direction: column;
  height: calc(100% - 106px);
  padding: 16px 15px;
  background-color: #ececec;
  overflow: hidden;
  gap: 15px;

  animation: ${(props) =>
    props.$state === undefined
      ? ``
      : props.$state !== 'wallet' &&
        props.$state !== 'stock' &&
        props.$state !== 'news'
      ? css`
          ${content_slide(props.$state)} 0.5s ease-in
        `
      : null};
`;

const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - (180px + 58px));
  min-height: 650px;
  gap: 15px;
`;

const Round = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 7px 24px;
  border-radius: 16px;

  & > p {
    color: #000000;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const PopUP = styled.div<{ $visible: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 328px;
  background-color: #ffffff;
  padding-bottom: 72px;
  border-radius: 16px 16px 0 0;
  position: fixed;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
  transform: ${(props) =>
    props.$visible ? 'translateY(-0%)' : 'translateY(100%)'};
  transition: ${(props) =>
    props.$visible ? 'transform 0.5s ease-out' : 'transform 0.5s ease-in'};

  & > span {
    display: inline-block;
    width: 134px;
    height: 5px;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 12px;
  }

  & > div:nth-child(2) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

    & > h2 {
      color: #000000;
      font-size: 2.4rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      padding: 56px 0 18px 0;

      &:first-child {
        padding-left: 24px;
      }

      &:last-child {
        padding-right: 24px;
      }
    }
  }
`;

const Price = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding: 16px 23px;
  gap: 8px;

  & > div {
    display: flex;
    justify-content: space-between;
    width: 100%;

    & > p:first-child {
      color: #000000;
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    & > p:last-child {
      color: #000000;
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    &:nth-child(2) {
      & > p:last-child {
        color: #ff0000;
      }
    }
  }
`;

const PopUP_Notice = styled.p`
  width: 100%;
  color: #ff0000;
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 16px 0 16px 24px;
`;

const PopUP_Button = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 37px;
  gap: 48px;

  & > button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
    color: #000000;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 16px 0;
    border-radius: 12px;
    cursor: pointer;
  }
`;

export default Game;
