import React from 'react';
import { styled } from 'styled-components';

function News() {
  return (
    <>
      <Contents>
        <List>
          {new Array(20).fill(0).map((_, index) => {
            return (
              <ListItem key={index}>
                <p>A엔터 소속 배우 이OO 부산 국제영화제에서 남우주연상 수상</p>
                <p>A엔터</p>
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
  cursor: pointer;

  & > p:first-child {
    color: #000;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  & > p:last-child {
    color: #000;
    text-align: right;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  &:hover {
    background: #efefef;
  }
`;

export default News;
