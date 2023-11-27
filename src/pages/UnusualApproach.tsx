import React from 'react';
import { styled } from 'styled-components';

function UnusualApproach() {
  return (
    <ErrorPageayout>
      <img src="/icons/error_icon.png" />
      <p>비정상적인 접근입니다...</p>
      <p>이전 페이지로 돌아가세요</p>
    </ErrorPageayout>
  );
}

const ErrorPageayout = styled.header`
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
    width: 150px;
    margin-bottom: 20px;
  }

  & > p {
    color: #ffffff;
    font-size: 2rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    word-break: break-all;
  }

  @media screen and (max-width: 768px) {
    & > img {
      width: 100px;
    }

    & > p {
      font-size: 1.4rem;
    }
  }
`;

export default UnusualApproach;
