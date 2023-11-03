import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useRecoilState } from 'recoil';
import { stockModalState, stockModalVals } from '@states/modalState';
import { currentRoomCode } from '@states/roomSetting';
import { getUserInfo } from '@apis/api/wallet';
import { useQuery } from 'react-query';
import { defaultAlert, networkErrorAlert } from '@utils/customAlert';
import { useNavigate } from 'react-router-dom';

interface StockList {
  com_name: string;
  buy_average: number;
  count: number;
  current_price: number;
  difference_percent: number;
  difference_price: number;
  id: string;
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
  const navigate = useNavigate();
  const [, setModalState] = useRecoilState(stockModalState); // 모달 visible
  const [, setModalVals] = useRecoilState(stockModalVals); // 모달창 값
  const [roomCode] = useRecoilState(currentRoomCode); // 방코드
  const [stockList, setStockList] = useState<StockList[]>([]);

  const getUserInformation = async () => {
    if (!roomCode) {
      defaultAlert('오류가 발생했습니다.');
      setTimeout(() => {
        navigate('/student', { replace: true });
      }, 1000);
      return;
    }
    const info = await getUserInfo(roomCode);
    if (info.status === 500 || info.status === 503) {
      networkErrorAlert();
      return;
    }

    return info.data;
  };

  const { data } = useQuery<
    | {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stock_list: any | undefined;
        user_info: UserInfo | undefined;
      }
    | undefined
  >('userInfo', getUserInformation);

  useEffect(() => {
    if (data && data?.stock_list) {
      const stockList = Object.keys(data.stock_list).map((item) => {
        const test = data.stock_list[item];
        test.id = item;
        return data.stock_list[item];
      });
      setStockList(stockList);
    }
  }, [data?.stock_list]);

  return (
    <>
      <Profile>
        {data?.user_info?.profile_num === 0 ? (
          <img src="/images/defaultProfile-gray1.png" />
        ) : null}
        {data?.user_info?.profile_num === 1 ? (
          <img src="/images/defaultProfile-gray2.png" />
        ) : null}
        {data?.user_info?.profile_num === 2 ? (
          <img src="/images/defaultProfile-gray3.png" />
        ) : null}
        <p>{data?.user_info?.username}</p>
      </Profile>

      <Asset>
        <AssetBox>
          <Information>
            <p>총자산</p>
            <p>{data?.user_info?.total_asset?.toLocaleString('ko-KR')}</p>
          </Information>
          <Information>
            <p>가용자산</p>
            <p>{data?.user_info?.using_asset?.toLocaleString('ko-KR')}</p>
          </Information>
        </AssetBox>

        <AssetBox>
          <Information>
            <p>총평가손익</p>
            <TotalIncome
              $color={
                data?.user_info?.total_roi && data?.user_info?.total_roi > 0
                  ? 'red'
                  : data?.user_info?.total_roi === 0
                  ? 'black'
                  : 'blue'
              }
            >
              {data?.user_info?.total_roi}%
            </TotalIncome>
          </Information>
          <Information>
            <p>보유주식총액</p>
            <p>
              {data?.user_info?.total_stock_holding?.toLocaleString('ko-KR')}
            </p>
          </Information>
        </AssetBox>
      </Asset>

      {data?.stock_list && Object.keys(data?.stock_list).length === 0 ? (
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
              ? stockList.map((stock: StockList, index: number) => {
                  return (
                    <ListItem
                      $color={
                        stock.percent > 0
                          ? 'red'
                          : stock.percent === 0
                          ? 'black'
                          : 'blue'
                      }
                      key={index}
                      onClick={() => {
                        setModalVals({
                          id: Number(stock.id),
                          kind: 'wallet',
                          company_name: stock.com_name,
                          inStock: stock.count,
                          first_menu_price: stock.buy_average,
                          second_menu_price: stock.current_price,
                          info:
                            stock.difference_price >= 0
                              ? `전 라운드가 보다 ${stock.difference_price.toLocaleString(
                                  'ko-KR'
                                )}원(${stock.percent}%)이 올랐어요`
                              : `전 라운드가 보다 ${stock.difference_price.toLocaleString(
                                  'ko-KR'
                                )}원(${stock.percent}%)이 내렸어요`,
                          difference: stock.difference_price,
                        });
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

const TotalIncome = styled.p<{ $color: string }>`
  color: ${(props) => props.$color};
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

const ListItem = styled.li<{ $color: string }>`
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
      color: ${(props) => props.$color};
      font-weight: 400;
    }
  }
`;

export default Wallet;
