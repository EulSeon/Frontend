import React from 'react';
import { styled } from 'styled-components';
import { useRecoilState } from 'recoil';
import { currentRoomCode } from '@states/roomSetting';
import { getNewsList } from '@apis/api/wallet';
import { useQuery } from 'react-query';
import { defaultAlert, networkErrorAlert } from '@utils/customAlert';
import { useNavigate } from 'react-router-dom';

interface NewsList {
  com_name: string;
  description: string;
  isGood: number;
}

function News() {
  const navigate = useNavigate();
  const [roomCode] = useRecoilState(currentRoomCode); // 방코드

  // 뉴스 리스트 가져오기
  const getNews = async () => {
    if (!roomCode) {
      defaultAlert('오류가 발생했습니다.');
      setTimeout(() => {
        navigate('/student', { replace: true });
      }, 1000);
      return;
    }
    const newsList = await getNewsList(roomCode);
    if (newsList.status === 500 || newsList.status === 503) {
      networkErrorAlert();
      return;
    }
    const nNewsList = newsList.data.descriptions.map(
      (description: string, index: number) => {
        return {
          com_name: newsList.data.com_name[index],
          description,
          isGood: newsList.data.isGood[index],
        };
      }
    );
    return nNewsList;
  };

  const { data: newsList } = useQuery<NewsList[]>('newsList', getNews); // 뉴스 리스트

  return (
    <>
      <Contents>
        <List>
          {newsList &&
            newsList.map((news, index) => {
              return (
                <ListItem key={index}>
                  <p>{news.description}</p>
                  <p>{news.com_name}</p>
                </ListItem>
              );
            })}
        </List>
      </Contents>
    </>
  );
}

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 360px;
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;

  & > h3 {
    color: #000000;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const List = styled.ul`
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 8px 18px;
  border-bottom: 1px solid #000000;
  color: #000000;
  gap: 8px;

  & > p:first-child {
    color: #000;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  & > p:last-child {
    color: #000;
    text-align: right;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

export default News;
