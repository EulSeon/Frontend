import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import Header_ from '@components/common/header';
import ListLayout_ from '@components/listLayout';
import Select_ from '@components/select';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  currentBtnState,
  currentRoomCode,
  currentRound,
  resultCondition,
} from '../states/roomSetting';
import { useRecoilState } from 'recoil';
import { socket } from 'socket';
import { checkGameResult, goNextRound } from '@apis/api/game';

// 더미 데이터
const data = [
  {
    round: 1,
    rank: 1,
    name: '20220631황을선',
    totalAssets: 13293957,
    roi: 157,
  },
  {
    rank: 2,
    name: '20220631황을선',
    totalAssets: 13293957,
    roi: 157,
  },
  {
    rank: 3,
    name: '20220631황을선',
    totalAssets: 13293957,
    roi: 157,
  },
];

interface ListI {
  rank: number;
  name: string;
  total_price: number;
  total_roi: number;
}

const header = ['라운드', '순위', '이름', '총 자산', '수익률'];

function GameResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [_, setCurrentBtn] = useRecoilState(currentBtnState); // 현재 선택된 버튼
  const [round, setRound] = useRecoilState(currentRound); // 현재 라운드
  const [condition, setCondition] = useRecoilState(resultCondition); // 게임 결과 조회 조건
  const [list, setList] = useState<ListI[]>([]); // 게임 결과 리스트

  // 다음 라운드로 넘어가는 기능
  const _goNextRound = async () => {
    const result = await goNextRound(state.roomPW);
    if (result.status === 200) {
      alert('라운드가 종료되었습니다.');
      return;
    }
    if (result.status === 500) {
      alert('오류가 발생했습니다. 다시 시도해주세요');
      return;
    }
    setCurrentBtn('game');
    socket.emit('startTimer', state.roomPW); // 타이머 시작
    navigate(-1); // 게임 대기방으로 다시 돌아감.
  };

  useEffect(() => {
    setCondition({
      round,
      opt: 0,
    });
  }, []);

  useEffect(() => {
    socket.emit('room_connect', state.roomPW); // 방 접속 이벤트
    checkResult();
  }, [condition]);

  const checkResult = async () => {
    const result = await checkGameResult(
      state.roomPW as string,
      condition.round as number,
      condition.opt as number
    );

    setList(result.data);
  };

  return (
    <GameResultLayout>
      <Header_ />
      <WaitingRoomList>
        <ListLayout_
          title="결과 조회"
          src="/icons/result_icon.svg"
          buttons
          buttonInfo={{
            button1: {
              value: '결과 저장하기',
            },
            button2: {
              value: '다음 라운드',
              onClick: () => {
                _goNextRound();
              },
            },
          }}
          result={{ data, header }}
        >
          <ListTitle>
            <h3>{round}라운드 랭킹</h3>
            <div>
              <Select_
                title={{ value: '라운드별', visible: false }}
                set={{ start: 1, count: round, standard: 1 }}
                defaultValue="라운드별"
              />
              <Select_
                title={{ value: '구분', visible: false }}
                set={{ start: 5, count: 2, standard: 1 }}
                defaultValue="구분"
              />
            </div>
          </ListTitle>
          <ResultHeader>
            <p>학생 이름</p>
            <p>총 자산</p>
            <p>수익률</p>
          </ResultHeader>
          <ResultContent>
            <table>
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <tbody>
                {list.map((student, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <Profile src="/images/defaultProfile.svg" />
                        <p>{student.name}</p>
                      </td>
                      <td>{student.total_price.toLocaleString('ko-KR')}</td>
                      <Roi
                        color={
                          student.total_roi > 0
                            ? 'red'
                            : student.total_roi === 0
                            ? 'black'
                            : 'blue'
                        }
                      >
                        {student.total_roi}%
                      </Roi>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ResultContent>
        </ListLayout_>
      </WaitingRoomList>
    </GameResultLayout>
  );
}

const GameResultLayout = styled.main`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(120deg, #3f51b5, #00bbd4 100%);
`;

const WaitingRoomList = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 25px;
  gap: 30px;

  & > div:nth-child(1) {
    height: unset;
    min-height: 500px;
  }

  @media screen and (max-width: 768px) {
    & > div:nth-child(1) {
      padding-top: 50px;
    }
  }
`;

const ListTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > h3 {
    color: #ffffff;
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  & > div {
    display: flex;
    gap: 24.66px;
  }

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    gap: 10px;

    & > h3 {
      font-size: 1.5rem;
    }

    & > div {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
`;

const ResultHeader = styled.div`
  display: flex;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.4);
  width: 100%;
  height: 42px;
  color: #000000;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  overflow: hidden;
  padding: 0 50px;
  margin-top: 18px;
  margin-bottom: 9px;

  & > p {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > p:nth-child(1) {
    width: 50%;
  }

  & > p:nth-child(2) {
    width: 30%;
  }

  & > p:nth-child(3) {
    width: 20%;
    justify-content: flex-end;
  }

  @media screen and (max-width: 768px) {
    padding: 0 30px;
    font-size: 3vw;
    white-space: nowrap;
  }
`;

const ResultContent = styled.div`
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.4);
  height: 520px;
  padding: 0 50px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  & > table {
    width: 100%;

    & > colgroup {
      & > col:nth-child(1) {
        width: 50%;
      }
      & > col:nth-child(2) {
        width: 30%;
      }
      & > col:nth-child(3) {
        width: 20%;
      }
    }

    & > tbody {
      & > tr {
        & > td:nth-child(1) {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: #000000;
          font-size: 2rem;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          gap: 20px;
          padding: 10px 0;
          white-space: nowrap;
        }

        & > td:nth-child(2) {
          color: #000000;
          text-align: center;
          font-size: 1.5rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          padding: 0 10px;
        }

        & > td:nth-child(3) {
          text-align: right;
          font-size: 2rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    padding: 0 30px;

    & > table {
      & > tbody {
        & > tr {
          & > td:nth-child(1) {
            font-size: 3vw;
            gap: 15px;
          }

          & > td:nth-child(2) {
            font-size: 2vw;
          }

          & > td:nth-child(3) {
            font-size: 3vw;
          }
        }
      }
    }
  }
`;

const Profile = styled.img`
  width: 34.5px;
  height: 34.5px;
  border-radius: 100px;

  @media screen and (max-width: 768px) {
    width: 30px;
    height: 30px;
  }

  @media screen and (max-width: 390px) {
    display: none;
  }
`;

const Roi = styled.td<{ color: string }>`
  color: ${(props) => props.color};
`;

export default GameResult;
