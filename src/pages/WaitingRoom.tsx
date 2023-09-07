import React from 'react';
import { styled } from 'styled-components';
import Header_ from '@components/common/header';
import ListLayout_ from '@components/listLayout';
import Select_ from '@components/select';

function WaitingRoom() {
  return (
    <WaitingRoomLayout>
      <Header_ />
      <WaitingRoomList>
        <ListLayout_ title="방 설정" src="/icons/room_icon.svg">
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
        <ListLayout_ title="참여인원" src="/icons/participant_icon.svg">
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
`;

export default WaitingRoom;
