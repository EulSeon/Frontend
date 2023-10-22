import { getNewsList } from '@apis/api/wallet';
import React, { useEffect } from 'react';
import { styled } from 'styled-components';
import { useRecoilState } from 'recoil';
import { newsList } from '@states/walletInformation';

function News() {
  const [news, setNews] = useRecoilState(newsList);

  // 뉴스 리스트 가져오기
  const getNews = async () => {
    const newsList = await getNewsList();
    const nNewsList = newsList.data.descriptions.map(
      (description: string, index: number) => {
        return {
          com_name: newsList.data.com_name[index],
          description,
          isGood: newsList.data.isGood[index],
        };
      }
    );
    setNews(nNewsList);
  };

  useEffect(() => {
    // 이미 뉴스 리스트를 가져온 경우에는 가져오지 말기
    if (news.length !== 0) {
      return;
    }
    getNews();
  }, []);

  return (
    <>
      <Contents>
        <List>
          {news.map((item, index) => {
            return (
              <ListItem key={index}>
                <p>{item.description}</p>
                <p>{item.com_name}</p>
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
