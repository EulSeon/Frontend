/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { css, keyframes, styled } from 'styled-components';
import StudentHeader from '@components/student/header';
import { useRecoilState } from 'recoil';
import { stockModalState } from '@states/modalState';
import { io } from 'socket.io-client';
import convertSecondsToMinute from '@utils/convertSecondsToMinute';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:8000');

function Sell() {
  const navigate = useNavigate();
  const holdingStock = 10; // 현재 내가 보유하고 있는 주식(임시로 설정)
  const [sellStock, setSellStock] = useState<string>(''); // 판매할 주식 수
  const [_, setModalState] = useRecoilState(stockModalState);
  const [stockPrice, setStockPrice] = useState(31009); // 현재 1주당 가격
  const [notice, setNotice] = useState<{
    available: boolean | undefined;
    content: string;
  }>({ available: true, content: '' }); // 안내 문구
  const [totalAsset, setTotalAsset] = useState(800000); // 가용자산
  const [timer, setTimer] = useState<{
    min: string | undefined;
    sec: string | undefined;
  }>({ min: undefined, sec: undefined }); // 타이머 시간

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connection server');
    });
    socket.emit('room_connect', 'kkLBlX'); // 방 접속 이벤트 : 임시 패스워드 값 넣어둠.
    socket.on('timerTick', (info: any) => {
      // 타이머 시간 가는 중 ...
      const { min, sec } = convertSecondsToMinute(info);
      setTimer({ min, sec });
    });
    socket.on('timerEnded', () => {
      navigate('/student/wallet'); // 라운드 종료시 게임방 메인페이지로 이동
    });
  }, []);

  useEffect(() => {
    if (sellStock.length === 0) {
      // 몇 주를 팔지 입력하지 않은 경우
      setNotice({ available: undefined, content: `${holdingStock}주 보유중` });
    } else {
      const getAsset = Number(sellStock) * stockPrice; // 벌 수 있는 금액

      if (Number(sellStock) <= holdingStock) {
        // 내가 해당 개수만큼 주식을 보유하고 있는 경우
        setNotice({
          available: true,
          content: `${getAsset.toLocaleString('ko-KR')}원을 벌어요.`,
        });
      } else {
        // 내가 해당 개수보다 주식을 덜 보유했을 경우
        setNotice({
          available: false,
          content: `보유중인 주식이 부족해요.`,
        });
      }
    }
  }, [sellStock]);

  useEffect(() => {
    return () => {
      setModalState((pre) => ({
        ...pre,
        buttonState: null,
      }));
    };
  }, []);

  return (
    <SellLayout>
      <StudentHeader />
      <Main>
        <PriceBox>
          <p>{stockPrice.toLocaleString('ko-KR')}</p>
          <p>현재 1주당 가격</p>
        </PriceBox>
        <BuyStock $value={sellStock} $available={notice.available}>
          <p>
            {sellStock.length === 0 ? <span></span> : null}
            {sellStock.length === 0 ? '몇 주를 팔까요?' : sellStock + '주'}
          </p>
          <p>{notice.content}</p>
        </BuyStock>
        <AvailableAssets>
          <p>
            {(totalAsset + Number(sellStock) * stockPrice).toLocaleString(
              'ko-KR'
            )}
            원
          </p>
          <p>가용자산</p>
        </AvailableAssets>
        <KeyPad>
          <Line>
            {new Array(3).fill(0).map((_, index) => {
              return (
                <button
                  key={index}
                  onClick={(e: any) => {
                    setSellStock((pre) => pre + String(e.target.innerText));
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
                    setSellStock((pre) => pre + String(e.target.innerText));
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
                    setSellStock((pre) => pre + String(e.target.innerText));
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
                if (sellStock.length === 0) return; // 0주는 입력할 수 없도록
                setSellStock((pre) => pre + String(e.target.innerText));
              }}
            >
              0
            </button>
            <button
              onClick={() => {
                setSellStock((pre) => pre.slice(0, -1));
              }}
            >
              <img src="/icons/delete_icon.svg" />
            </button>
          </Line>
        </KeyPad>
        <Button>
          <button>매도하기</button>
        </Button>
        <RoundBox>
          <Round>
            <p>N / 10 라운드</p>
            <p>
              {' '}
              {timer.min !== undefined && timer.sec !== undefined
                ? timer.min + ':' + timer.sec
                : '00:00'}
            </p>
          </Round>
        </RoundBox>
      </Main>
    </SellLayout>
  );
}

const SellLayout = styled.div`
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
  padding: 16px 20px 16px 20px;
  gap: 8px;

  & > p:first-child {
    left: 20px;
    color: #000000;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  & > p:last-child {
    color: #000000;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 400;
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

const shake = keyframes`
  0% {
    transform: translate3d(-2px, 0px, 0);
  }
  100% {
    transform: translate3d(2px, 0px, 0);
  }
`;

const BuyStock = styled.div<{
  $value: string;
  $available: boolean | undefined;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 16px 20px 16px 20px;
  gap: 8px;

  & > p:first-child {
    display: flex;
    align-items: center;
    color: ${(props) =>
      props.$value.length === 0 ? 'rgba(0, 0, 0, 0.5)' : '#000000'};
    font-size: 2.4rem;
    font-style: normal;
    font-weight: 600;
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
    color: ${(props) =>
      props.$available === undefined
        ? '#000000'
        : props.$available
        ? '#0038FF'
        : '#ff0000'};
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    animation: ${(props) =>
      props.$available === false
        ? css`
            ${shake} 0.1s 0s 3
          `
        : ``};
  }
`;

const AvailableAssets = styled(PriceBox)`
  padding: 16px 20px 62px 20px;
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

export default Sell;
