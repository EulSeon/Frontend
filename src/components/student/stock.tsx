import React from 'react';
import { styled } from 'styled-components';
import { useRecoilState } from 'recoil';
import { stockModalState } from '@states/modalState';

function Stock() {
  const [modalState, setModalState] = useRecoilState(stockModalState);

  return (
    <>
      <Contents>
        <h3>주식 목록</h3>
        <List>
          {new Array(20).fill(0).map((_, index) => {
            return (
              <ListItem
                key={index}
                onClick={() => {
                  setModalState((pre) => ({
                    ...pre,
                    visible: !pre.visible,
                  }));
                }}
              >
                <div>
                  <p>A엔터</p>
                </div>
                <div>
                  <p>310,090</p>
                  <p>+6.83%</p>
                </div>
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
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 15px 8px 21px;
  border-bottom: 1px solid #000000;
  color: #000000;
  cursor: pointer;

  &:hover {
    background: #e1e1e1;
  }

  & > div:first-child {
    display: flex;
    align-items: center;
    gap: 3px;

    & > p {
      color: #000000;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }

  & > div:last-child {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;

    & > p:first-child {
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    & > p:last-child {
      font-size: 1.2rem;
      color: red;
      font-weight: 400;
    }
  }
`;

export default Stock;
