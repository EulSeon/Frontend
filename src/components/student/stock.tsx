import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useRecoilState } from 'recoil';
import { stockModalState, stockModalVals } from '@states/modalState';
import { currentRoomCode } from '@states/roomSetting';
import { getStockList } from '@apis/api/wallet';

interface StockList {
  company_name: string;
  currentPrice: number;
  difference: number;
  percent: number;
  previousPrice: number;
}

function Stock() {
  const [, setModalState] = useRecoilState(stockModalState); // 모달 visible
  const [, setModalVals] = useRecoilState(stockModalVals); // 모달창 값
  const [roomCode] = useRecoilState(currentRoomCode); // 방코드
  const [stockList, setStockList] = useState<StockList[]>([]); // 주식 목록

  const _getStockList = async () => {
    const list = await getStockList(roomCode as string);
    setStockList(list.data);
  };

  useEffect(() => {
    _getStockList();
  }, []);

  return (
    <>
      <Contents>
        <h3>주식 목록</h3>
        <List>
          {stockList.map((stock, index) => {
            return (
              <ListItem
                key={index}
                onClick={() => {
                  setModalVals({
                    id: index + 1,
                    kind: 'stock',
                    company_name: stock.company_name,
                    inStock: undefined,
                    first_menu_price: stock.previousPrice,
                    second_menu_price: stock.currentPrice,
                    info: `전 라운드가 보다 ${stock.difference}원(${stock.percent}%)이 올랐어요`,
                    difference: stock.difference,
                  });
                  setModalState((pre) => ({
                    ...pre,
                    visible: !pre.visible,
                  }));
                }}
              >
                <div>
                  <p>{stock.company_name}</p>
                </div>
                <div>
                  <p>{stock.currentPrice.toLocaleString('ko-KR')}</p>
                  <p>{stock.percent}%</p>
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
