import React from 'react';
import { styled } from 'styled-components';
import Header_ from '@components/common/header';
import Footer from '@components/common/footer';

function Contact() {
  return (
    <MainLayout>
      <Header_ />
      <BackgroundImage src="/images/mainBackgroundImage.svg" />
      <Main>
        <Logo src="/images/evidLetterLogo.svg" />
        <Info>
          <li>대표 : 황을선</li>
          <li>연락처 : +82)10-4665-0917</li>
          <li>이메일 : dmftjs915@naver.com</li>
          <li>소재지 : (05005) 서울특별시 광진구 광나루로 17길 14-16</li>
        </Info>
      </Main>
      <Footer />
    </MainLayout>
  );
}

const MainLayout = styled.main`
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background: linear-gradient(120deg, #3f51b5, #00bbd4 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.img`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: 56px;

  @media screen and (max-width: 768px) {
    align-items: center;
    width: 100%;
    padding: 0 10vw;
  }
`;

const Logo = styled.img`
  width: 214.668px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Info = styled.ul`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-size: 2.4rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  gap: 32px;
  white-space: nowrap;
  padding: 60px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.2);

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
    white-space: normal;
    word-break: break-all;
  }
`;

export default Contact;
