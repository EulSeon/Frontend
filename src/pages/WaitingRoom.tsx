/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import Header_ from '@components/common/header';
import ListLayout_ from '@components/listLayout';
import Select_ from '@components/select';

function WaitingRoom() {
  const pwRef = useRef<any>(null);
  const [pwVisible, setPwVisible] = useState(false);

  useEffect(() => {
    // 패스워드를 제외한 백그라운드를 클릭했을 경우 패스워드 사라지도록 설정
    const handleOutsideClick = (e: MouseEvent) => {
      if (!pwRef.current || !pwRef.current.contains(e.target)) {
        setPwVisible(false);
      }
    };
    document.addEventListener('click', handleOutsideClick, true);
    return () => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
  }, [pwRef]);

  return (
    <WaitingRoomLayout>
      <BlackBackground visible={pwVisible}>
        <PassWord ref={pwRef}>
          <p>123456</p>
        </PassWord>
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
                  setPwVisible(true);
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
                  console.log('GAME START 버튼 클릭');
                },
              },
            }}
          >
            <UserList>
              {new Array(40).fill(0).map((x, index) => {
                return (
                  <UserProfile key={index}>
                    <img src="/images/defaultProfile.svg" />
                    <p key={x}>김태하</p>
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

const BlackBackground = styled.div<{ visible: boolean }>`
  /* display: flex; */
  display: ${(props) => (props.visible ? 'flex' : 'none')};
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

export default WaitingRoom;
