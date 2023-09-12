import React from 'react';
import { styled } from 'styled-components';
import Header_ from '@components/common/header';
import ListLayout_ from '@components/listLayout';
import Select_ from '@components/select';

function GameResult() {
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
              onClick: () => {
                console.log('첫번째 버튼');
              },
            },
            button2: {
              value: '다음 라운드',
              onClick: () => {
                console.log('두번째 버튼');
              },
            },
          }}
        >
          <ListTitle>
            <h3>0라운드 랭킹</h3>
            <div>
              <Select_
                set={{ start: 5, count: 6, standard: 1 }}
                defaultValue="라운드별"
              />
              <Select_
                set={{ start: 5, count: 6, standard: 1 }}
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
                {new Array(19).fill(0).map((_, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <Profile src="/images/defaultProfile.svg" />
                        <p>20220631 황을선</p>
                      </td>
                      <td>13,293,957</td>
                      <td>157%</td>
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
  min-width: 1280px;
  min-height: 100vh;
  background: linear-gradient(120deg, #3f51b5, #00bbd4 100%);
  position: relative;
  overflow: hidden;
`;

const WaitingRoomList = styled.div`
  display: flex;
  width: 1280px;
  margin: 0 auto;
  padding: 0 25px;
  gap: 30px;
  width: 600px;
  height: 756px;
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
`;

const ResultContent = styled.div`
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.4);
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  padding: 0 50px;

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
          justify-content: left;
          color: #000000;
          font-size: 2rem;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          gap: 20px;
          padding: 10px 0;
        }

        & > td:nth-child(2) {
          color: #000000;
          text-align: center;
          font-size: 1.5rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }

        & > td:nth-child(3) {
          color: #ff0000;
          text-align: right;
          font-size: 2rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }
`;

const Profile = styled.img`
  width: 34.5px;
  height: 34.5px;
  border-radius: 100px;
`;

export default GameResult;
