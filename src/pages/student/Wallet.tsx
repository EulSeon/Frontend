/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import StudentHeader from '@components/student/header';
import StudentLayout_ from '@components/student/layout';
import Wallet from '@components/student/wallet';
import Stock from '@components/student/stock';
import News from '@components/student/news';

function Game() {
  const navigate = useNavigate();
  const popupRef = useRef<any>(null);
  const [current, setCurrent] = useState('wallet');
  const [selectedNav, setSelectedNav] = useState('wallet');

  return (
    <StudentLayout_>
      <BlackBackground></BlackBackground>
      <StudentHeader navbar />
      <Main>
        <ContentSection>
          {current === 'wallet' ? <Wallet /> : null}
          {current === 'stock' ? <Stock /> : null}
          {current === 'news' ? <News /> : null}
        </ContentSection>
        <Round>
          <p>N / 10 라운드</p>
          <p>10:00</p>
        </Round>
      </Main>

      <PopUP ref={popupRef}>
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
            <button>추가매수</button>
            <button>매도하기</button>
          </PopUP_Button>
        ) : null}
        {selectedNav === 'stock' ? (
          <PopUP_Button>
            <button>매수하기</button>
          </PopUP_Button>
        ) : null}
      </PopUP>
    </StudentLayout_>
  );
}

const BlackBackground = styled.div`
  display: flex;
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

const PopUP = styled.div`
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
