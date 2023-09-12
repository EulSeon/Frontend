/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import Header_ from '@components/common/header';
import ListLayout_ from '@components/listLayout';
import Select_ from '@components/select';
import { useNavigate } from 'react-router-dom';

function WaitingRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pwRef = useRef<any>(null);
  const [visible, setVisible] = useState<boolean>(false); // 팝업창 visible
  const [currentBtn, setCurrentBtn] = useState<string>(''); // 현재 선택된 버튼

  // Main페이지에서 넘어온 roomPW
  console.log(state.roomPW);

  const onClickBlackBackground = (e: any) => {
    if (
      // 현재 클릭한 버튼이 패스워드일 경우에만, 바탕을 클릭했을 때 사라지도록 설정
      currentBtn === 'password' &&
      (!pwRef.current || !pwRef.current.contains(e.target))
    ) {
      setVisible(false);
    }
  };

  const [time, setTime] = useState(5); // 일단 임시로 시간 설정

  // 타이머 만들기는 했지만 아직 고민해야할 부분이 많음.
  useEffect(() => {
    if (currentBtn !== 'game') return;
    const timer = setInterval(() => {
      setTime((pre) => pre - 1);
    }, 1000);
    if (time === 0) {
      setCurrentBtn('gameover');
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [time, currentBtn]);

  return (
    <WaitingRoomLayout>
      <BlackBackground $visible={visible} onClick={onClickBlackBackground}>
        {currentBtn === 'password' ? (
          <PassWord ref={pwRef}>
            <p>123456</p>
          </PassWord>
        ) : null}
        {currentBtn === 'game' ? (
          <GameInProgress>
            <img src="/images/defaultProfile.svg" />
            <div>
              <p>0라운드</p>
              <p>00:0{time}</p>
            </div>
          </GameInProgress>
        ) : null}
        {currentBtn === 'gameover' ? (
          <GameOver>
            <p>라운드 종료</p>
            <OptionBox>
              <button
                onClick={() => {
                  navigate('/room/1/result');
                }}
              >
                결과 조회
              </button>
              <button
                onClick={() => {
                  setCurrentBtn('game');
                  setTime(5);
                }}
              >
                다음 라운드
              </button>
            </OptionBox>
          </GameOver>
        ) : null}
      </BlackBackground>

      <Header_ />
      <Main>
        <WaitingRoomList>
          <ListLayout_
            title="방 설정"
            src="/icons/room_icon.svg"
            buttonInfo={{
              button1: {
                value: 'PASSWORD',
                onClick: () => {
                  setVisible(true);
                  setCurrentBtn('password');
                },
              },
            }}
          >
            <SelectList>
              <Select_
                title="라운드"
                set={{ start: 5, count: 6, standard: 1 }}
                defaultValue="라운드"
              />
              <Select_
                title="제한시간"
                set={{ start: 30, count: 20, standard: 30 }}
                defaultValue="~분 ~초"
              />
              <Select_
                title="시드머니"
                set={{ start: 100, count: 19, standard: 50 }}
                defaultValue="만원"
              />
            </SelectList>

            <ListImage src="/images/roomsettingImage.svg" />
          </ListLayout_>
          <ListLayout_
            title="참여인원"
            src="/icons/participant_icon.svg"
            buttonInfo={{
              button1: {
                value: 'GAME START',
                onClick: () => {
                  setVisible(true);
                  setCurrentBtn('game');
                },
              },
            }}
          >
            <UserList>
              {new Array(40).fill(0).map((_, index) => {
                return (
                  <UserProfile key={index}>
                    <img src="/images/defaultProfile.svg" />
                    <p>김태하</p>
                  </UserProfile>
                );
              })}
            </UserList>
            <ListImage2 src="/images/participantImage.svg" />
          </ListLayout_>
        </WaitingRoomList>
      </Main>
    </WaitingRoomLayout>
  );
}

const WaitingRoomLayout = styled.main`
  width: 100%;
  height: 100%;
  min-width: 1280px;
  min-height: 100vh;
  background: linear-gradient(120deg, #3f51b5, #00bbd4 100%);
  position: relative;
  overflow: hidden;
`;

const BlackBackground = styled.div<{ $visible: boolean }>`
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  min-width: 1280px;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.36);
  position: absolute;
  z-index: 2;
`;

const PassWord = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 720px;
  height: 240px;
  border-radius: 24px;
  background: #ffffff;

  & > p {
    color: #000000;
    font-size: 6.4rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 51.2px; // 마지막 글자에도 간격 처리 됨.
    text-indent: 51.2px; // 따라서 들여쓰기 기능 추가
  }
`;

const GameInProgress = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 720px;
  height: 320px;
  border-radius: 24px;
  background: #ffffff;
  gap: 64px;

  & > img {
    width: 79.492px;
    height: 79.492px;
  }

  & > div {
    display: flex;
    gap: 80px;
    & > p {
      color: #000000;
      font-size: 4.8rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;

      &:nth-child(2) {
        width: 130px;
      }
    }
  }
`;

const GameOver = styled.div`
  display: flex;
  flex-direction: column;
  width: 720px;
  height: 320px;
  border-radius: 24px;
  background: #ffffff;
  overflow: hidden;

  & > p {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 242px;
    color: #000000;
    font-size: 4.8rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const OptionBox = styled.div`
  width: 100%;
  border-top: 2px solid #8c8c8c;
  height: 79px;
  background-color: #ffffff;

  & > button {
    background-color: #ffffff;
    height: 100%;
    width: 50%;
    color: #3f51b5;
    font-size: 3.2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    cursor: pointer;
    -moz-transition: all, 0.3s;
    -o-transition: all, 0.3s;
    -webkit-transition: all, 0.3s;
    transition: all, 0.3s;

    &:first-child {
      border-right: 2px solid #8c8c8c;
    }

    &:hover {
      background-color: #a7c2e4;
      color: #ffffff;
    }
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const WaitingRoomList = styled.div`
  display: flex;
  width: 1280px;
  margin: 0 auto;
  padding: 0 25px;
  gap: 30px;
`;

const SelectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 29px;
  position: absolute;
  left: 37px;
  top: 65px;
  z-index: 1;
`;

const ListImage = styled.img`
  align-self: center;
  position: absolute;
  bottom: 91px;
`;

const UserList = styled.div`
  display: flex;
  flex-flow: wrap;
  gap: 22px 79px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const UserProfile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  z-index: 1;

  & > img {
    width: 56px;
    height: 56px;
    border-radius: 100px;
  }

  & > p {
    color: #ffffff;
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    white-space: nowrap;
  }
`;

const ListImage2 = styled.img`
  align-self: center;
  position: absolute;
  bottom: 91px;
  opacity: 0.3;
  pointer-events: none;
`;

export default WaitingRoom;
