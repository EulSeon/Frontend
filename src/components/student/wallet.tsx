import React, { useState } from 'react';
import { styled } from 'styled-components';

function Wallet() {
  const [currentComponent, setCurrentComponent] = useState(false); // 임시로 추가

  return (
    <>
      <Profile>
        <img src="/images/defaultProfile-gray1.svg" />
        <p>2학년 4반 김유경</p>
      </Profile>

      <Asset>
        <AssetBox>
          <Information>
            <p>총자산</p>
            <p>2,000,000,000</p>
          </Information>
          <Information>
            <p>가용자산</p>
            <p>1,000,000,000</p>
          </Information>
        </AssetBox>
        <AssetBox>
          <Information>
            <p>총평가손익</p>
            <TotalIncome>1000%</TotalIncome>
          </Information>
          <Information>
            <p>보유주식총액</p>
            <p>1,000,000,000</p>
          </Information>
        </AssetBox>
      </Asset>

      {currentComponent ? (
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
            {new Array(20).fill(0).map((_, index) => {
              return (
                <ListItem key={index}>
                  <div>
                    <p>A엔터</p>
                    <p>10주</p>
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
  height: 360px;
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
