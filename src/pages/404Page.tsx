import React from 'react';
import { styled } from 'styled-components';

function ErrorPage() {
  return (
    <UnusualApproachLayout>
      <img src="/images/errorImage.png" />
      <h1>404</h1>
      <p>페이지가 존재하지 않습니다</p>
      <p>올바른 링크를 다시 입력해보세요</p>
    </UnusualApproachLayout>
  );
}

const UnusualApproachLayout = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  min-height: 500px;
  background: linear-gradient(120deg, #3f51b5, #00bbd4 100%);
  padding-bottom: 15vh;

  & > img {
    width: 200px;
    margin-bottom: 20px;
  }

  & > h1 {
    color: #ffffff;
    font-size: 5rem;
  }

  & > p {
    &:nth-child(3) {
      color: #ffffff;
      font-size: 2rem;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
      padding-bottom: 30px;
    }

    &:nth-child(4) {
      color: #ffffff;
      font-size: 1.3rem;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
    }
  }

  @media screen and (max-width: 768px) {
    & > img {
      width: 150px;
    }

    & > h1 {
      font-size: 4rem;
    }

    & > p {
      &:nth-child(3) {
        font-size: 1.4rem;
      }

      &:nth-child(4) {
        font-size: 1rem;
      }
    }
  }
`;

export default ErrorPage;
