import React from 'react';
import { styled } from 'styled-components';

function Footer() {
  return (
    <FooterLayout>
      <p>ⓒEVID 2023 all rights reserved</p>
    </FooterLayout>
  );
}

const FooterLayout = styled.header`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 30px 0;
  position: absolute;
  bottom: 0;

  & > p {
    color: #ffffff;
    font-size: 2rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    word-break: break-all;
  }

  @media screen and (max-width: 768px) {
    & > p {
      font-size: 1.4rem;
    }
  }
`;

export default Footer;
