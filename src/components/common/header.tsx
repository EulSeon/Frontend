import React from 'react';
import { styled } from 'styled-components';

function Header_() {
  return (
    <HeaderLayout>
      <Header>
        <img src="/images/signatureLogo.svg" />
        <Navbar>
          <p>HOME</p>
          <p>ABOUT</p>
          <p>CONTACT</p>
        </Navbar>
      </Header>
    </HeaderLayout>
  );
}

const HeaderLayout = styled.header`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px;
`;

const Navbar = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 361px;
  color: #ffffff;

  & > p {
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

export default Header_;
