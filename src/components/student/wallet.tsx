import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useRecoilState } from 'recoil';
import { stockModalState } from '@states/modalState';
import { currentRoomCode } from '@states/roomSetting';
import { getUserInfo } from '@apis/api/wallet';

interface StockList {
  com_name: string;
  buy_average: number;
  count: number;
  percent: number;
}

interface UserInfo {
  profile_num: number;
  total_asset: number;
  total_roi: number;
  total_stock_holding: number;
  username: string;
  using_asset: number;
}

function Wallet() {
  const [, setModalState] = useRecoilState(stockModalState);
  const [roomCode] = useRecoilState(currentRoomCode); // 방코드
  const [stockList, setStockList] = useState<StockList[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    profile_num: 0,
    total_asset: 0,
    total_roi: 0,
    total_stock_holding: 0,
    username: '',
    using_asset: 0,
  });

  const getUserInformation = async () => {
    const info = await getUserInfo(roomCode as string);
    console.log(info);
    const listArray = Object.keys(info.data.stock_list).map(
      (item) => info.data.stock_list[item]
    ); // 객체 -> 배열
    setUserInfo(info.data.user_info);
    setStockList(listArray);
  };

  useEffect(() => {
    getUserInformation();
  }, []);

  return (
    <>
      <Profile>
        {userInfo.profile_num === 0 ? (
          <img src="/images/defaultProfile-gray1.svg" />
        ) : null}
        {userInfo.profile_num === 1 ? (
          <img src="/images/defaultProfile-gray2.svg" />
        ) : null}
        {userInfo.profile_num === 2 ? (
          <img src="/images/defaultProfile-gray3.svg" />
        ) : null}
        <p>{userInfo?.username}</p>
      </Profile>

      <Asset>
        <AssetBox>
          <Information>
            <p>총자산</p>
            <p>{userInfo?.total_asset?.toLocaleString('ko-KR')}</p>
          </Information>
          <Information>
            <p>가용자산</p>
            <p>{userInfo?.using_asset?.toLocaleString('ko-KR')}</p>
          </Information>
        </AssetBox>
        <AssetBox>
          <Information>
            <p>총평가손익</p>
            <TotalIncome>{userInfo?.total_roi}%</TotalIncome>
          </Information>
          <Information>
            <p>보유주식총액</p>
            <p>{userInfo?.total_stock_holding?.toLocaleString('ko-KR')}</p>
          </Information>
        </AssetBox>
      </Asset>

      {stockList.length === 0 ? (
        <Contents_None>
          <p>
            뉴스를 분석하고 주가가 오를것 같은
            <br />
            기업의 주식을 구매하세요!
          </p>
        </Contents_None>
      ) : (
        <Contents>
          <h3>주식 목록</h3>
          <List>
            {stockList.length
              ? stockList.map((stock, index) => {
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
                        <p>{stock.com_name}</p>
                        <p>{stock.count}주</p>
                      </div>
                      <div>
                        <p>{stock.buy_average.toLocaleString('ko-KR')}</p>
                        <p>{stock.percent}%</p>
                      </div>
                    </ListItem>
                  );
                })
              : null}
          </List>
        </Contents>
      )}
    </>
  );
}

const Profile = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 16px 24px;
  border-radius: 16px;
  gap: 16px;

  & > img {
    border-radius: 100px;
    width: 64px;
    height: 64px;
  }

  & > p {
    color: #000000;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

const Asset = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px 0px 16px 24px;
  gap: 21px;
`;

const AssetBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 21px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 80px;
  color: #000000;

  & > p {
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    white-space: nowrap;
  }

  & > p:first-child {
    font-size: 1.2rem;
    font-weight: 600;
  }

  & > p:last-child {
    font-size: 1.6rem;
  }
`;

const TotalIncome = styled.p`
  color: #ff0000;
`;

const Contents_None = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #ffffff;
  border-radius: 16px;

  & > p {
    text-align: center;
    color: #000000;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 360px;
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;

  & > h3 {
    text-align: center;
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
  color: #000000;
  padding: 8px 15px 8px 21px;
  border-bottom: 1px solid #000000;
  cursor: pointer;

  &:hover {
    background: #e1e1e1;
  }

  & > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 3px;

    & > p:first-child {
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    & > p:last-child {
      font-size: 1.2rem;
      font-weight: 400;
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

export default Wallet;
