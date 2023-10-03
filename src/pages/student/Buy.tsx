/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { keyframes, styled } from 'styled-components';
import StudentHeader from '@components/student/header';
import { useRecoilState } from 'recoil';
import { stockModalState } from '@states/modalState';

function Buy() {
  const [value, setValue] = useState<string>('');
  const [modalState, setModalState] = useRecoilState(stockModalState);

  useEffect(() => {
    return () => {
      setModalState((pre) => ({
        ...pre,
        buttonState: null,
      }));
    };
  }, []);

  return (
    <BuyLayout>
      <StudentHeader />
      <Main>
        <PriceBox>
          <p>현재 1주당 가격</p>
          <p>31,009</p>
        </PriceBox>
        <BuyStock>
          <p>
            {value.length === 0 ? <span></span> : null}
            {value.length === 0 ? '몇 주를 살까요?' : value}
          </p>
          <p>가용자산 800,000</p>
          <p>00000원을 사용할게요</p>
        </BuyStock>

        <KeyPad>
          <Line>
            {new Array(3).fill(0).map((_, index) => {
              return (
                <button
                  key={index}
                  onClick={(e: any) => {
                    setValue((pre) => pre + String(e.target.innerText));
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </Line>
          <Line>
            {new Array(3).fill(0).map((_, index) => {
              return (
                <button
                  key={index}
                  onClick={(e: any) => {
                    setValue((pre) => pre + String(e.target.innerText));
                  }}
                >
                  {index + 4}
                </button>
              );
            })}
          </Line>
          <Line>
            {new Array(3).fill(0).map((_, index) => {
              return (
                <button
                  key={index}
                  onClick={(e: any) => {
                    setValue((pre) => pre + String(e.target.innerText));
                  }}
                >
                  {index + 7}
                </button>
              );
            })}
          </Line>
          <Line>
            <button></button>
            <button
              onClick={(e: any) => {
                setValue((pre) => pre + String(e.target.innerText));
              }}
            >
              0
            </button>
            <button
              onClick={() => {
                setValue((pre) => pre.slice(0, -1));
              }}
            >
              <img src="/icons/delete_icon.svg" />
            </button>
          </Line>
        </KeyPad>
        <Button>
          <button>매수하기</button>
        </Button>
        <RoundBox>
          <Round>
            <p>N / 10 라운드</p>
            <p>10:00</p>
          </Round>
        </RoundBox>
      </Main>
    </BuyLayout>
  );
}

const BuyLayout = styled.div`
  background-color: #ececec;
`;

const up_slide = () => keyframes`
from {
  transform: translateY(100px);
  opacity: 0;
}

to {
  transform:translateY(0px);
  opacity: 1;
}
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /* min-height: calc(100vh - 108px); */
  background-color: #ececec;
  animation: ${up_slide} 0.5s 0s forwards;
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px 0 16px 20px;
  gap: 8px;

  & > p:first-child {
    left: 20px;
    color: #000000;
    font-size: 1.2rem;
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
`;

const twinkle = keyframes`
  from {
   opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BuyStock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 0px 0px 143px 20px;
  gap: 8px;

  & > p:first-child {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.5);
    font-size: 2.4rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    & > span {
      display: inline-block;
      width: 3px;
      height: 20px;
      background-color: rgba(0, 0, 0, 0.403);
      animation: ${twinkle} 0.5s 0s alternate infinite;
    }
  }

  & > p:nth-child(2) {
    color: #000000;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  & > p:last-child {
    color: #3f51b5;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

const KeyPad = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 611px);
  min-height: 269px;
`;

const Line = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  & > button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% / 3);
    height: 100%;
    min-height: 67.25px;
    color: #000000;
    text-align: center;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    background: none;
    cursor: pointer;
  }
`;

const Button = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 67px;

  & > button {
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
    padding: 16px 0;
    border-radius: 12px;
    cursor: pointer;
  }
`;

const RoundBox = styled.div`
  padding: 16px 15px;
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

export default Buy;
