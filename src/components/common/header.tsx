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
          <Link to="/about">ABOUT</Link>
          <Link to="/contact">CONTACT</Link>
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

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
    padding: 32px 30px 0 30px;

    & > img {
      width: 120px;
    }
  }
`;

const Navbar = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 361px;
  max-width: 361px;

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

  @media screen and (max-width: 768px) {
    width: 100%;
    justify-content: center;
    gap: 10vw;
    overflow: auto;

    & > a {
      font-size: 1.3rem;
    }
  }
`;

export default Header_;
