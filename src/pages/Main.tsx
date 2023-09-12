/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import Header_ from '@components/common/header';
import Footer from '@components/common/footer';
import { getGameRoomPassword } from '@apis/api/game';

function Main_() {
  const navigate = useNavigate();

  const onClickCreateRoomBtn = async () => {
    // 게임방 비밀번호 요청
    // 비밀번호를 성공적으로 받으면 게임 대기방으로 이동
    const roomPW = await getGameRoomPassword();

    if (roomPW.status !== 200 || roomPW.data.status !== 'success') {
      // 패스워드가 제대로 전달되지 않았을 경우
      alert('다시 시도해주세요.');
      return;
    }

    navigate('/room/wait', { state: { roomPW: roomPW.data.room_code } });
  };

  return (
    <MainLayout>
      <Header_ />
      <BackgroundImage src="/images/mainBackgroundImage.svg" />
      <Main>
        <Logo src="/images/mainLogo.svg" />
        <p>
          학생들도 주식에 쉽게 다가갈 수 있는
          <br />
          모의주식 서비스 E - STOCK 입니다.
        </p>
        <CreateRoomBtn onClick={onClickCreateRoomBtn}>
          <div>
            <img src="/icons/add_icon.svg" alt="방만들기 아이콘" />
            <p>Create New Room</p>
          </div>
        </CreateRoomBtn>
      </Main>
      <Footer />
    </MainLayout>
  );
}

const MainLayout = styled.main`
  width: 100%;
  height: 100%;
  min-width: 1280px;
  min-height: 100vh;
  background: linear-gradient(120deg, #3f51b5, #00bbd4 100%);
  position: relative;
  overflow: hidden;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: 40px;

  & > p {
    color: #ffffff;
    text-align: center;
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const BackgroundImage = styled.img`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Logo = styled.img`
  align-self: center;
  width: 322px;
  height: 232px;
`;

const CreateRoomBtn = styled.button`
  background: none;
  align-self: center;
  cursor: pointer;

  & > div {
    display: flex;
    height: 56px;
    padding: 16px 32px;
    align-items: center;
    gap: 20px;
    border-radius: 38px;
    background-color: #ffffff;
    color: #000000;
    -moz-transition: all, 0.5s;
    -o-transition: all, 0.5s;
    -webkit-transition: all, 0.5s;
    transition: all, 0.5s;

    & > p {
      font-size: 2rem;
      font-style: normal;
      font-weight: 400;
    }

    &:hover {
      color: #ffffff;
      background-color: #a7c2e4;
    }

    &:hover > img {
      filter: brightness(600%);
    }

    & > img {
      transition: filter, 0.5s;
    }
  }
`;

export default Main_;