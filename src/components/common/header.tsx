import React from 'react';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';

function Header_() {
  return (
    <HeaderLayout>
      <Header>
        <img src="/images/signatureLogo.svg" />
        <Navbar>
          <Link to="/">HOME</Link>
          <Link to="/">ABOUT</Link>
          <Link to="/">CONTACT</Link>
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

  & > a {
    color: #ffffff;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-decoration: none;
    z-index: 1;
    cursor: pointer;
  }
`;

export default Header_;
