/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import StudentHeader from '@components/student/header';
import StudentLayout_ from '@components/student/layout';
import Wallet from '@components/student/wallet';
import Stock from '@components/student/stock';
import News from '@components/student/news';
import { useRecoilState } from 'recoil';
import { navbarState } from '@states/navbarState';
import { stockModalState } from '@states/modalState';

function Game() {
  const navigate = useNavigate();
  const [selectedNav] = useRecoilState(navbarState);
  const [modalState, setModalState] = useRecoilState(stockModalState);
  const popupRef = useRef<any>(null);

  const onClickBlackBackground = (e: any) => {
    if (!popupRef.current || !popupRef.current.contains(e.target)) {
      setModalState((pre) => ({
        ...pre,
        visible: false,
      }));
    }
  };

  // 모달창 열린 후 배경 스크롤 불가능하도록 설정
  useEffect(() => {
    if (modalState.visible) {
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
  }, [modalState.visible]);

  return (
    <StudentLayout_>
      <BlackBackground
        $visible={modalState.visible}
        onClick={onClickBlackBackground}
      ></BlackBackground>
      <StudentHeader navbar />
      <Main>
        <ContentSection>
          {selectedNav === 'wallet' ? <Wallet /> : null}
          {selectedNav === 'stock' ? <Stock /> : null}
          {selectedNav === 'news' ? <News /> : null}
        </ContentSection>
        <Round>
          <p>N / 10 라운드</p>
          <p>10:00</p>
        </Round>
      </Main>

      <PopUP $visible={modalState.visible} ref={popupRef}>
        <span></span>
        <h2>A 엔터</h2>
        <Price>
          <div>
            <p>전 라운드 가격</p>
            <p>31,0000</p>
          </div>
          <div>
            <p>현 라운드 가격</p>
            <p>46,5000</p>
          </div>
        </Price>
        <PopUP_Notice>전 라운드보다 15,500원(+50%)이 올랐어요</PopUP_Notice>
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

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: calc(100% - 106px);
  padding: 16px 15px;
  background-color: #ececec;
  overflow: hidden;
  gap: 15px;
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

  & > h2 {
    color: #000000;
    font-size: 2.4rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    padding: 56px 0 18px 24px;
    width: 100%;
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

    & > p {
      color: #000000;
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
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
