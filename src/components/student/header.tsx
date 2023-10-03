import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

interface StudentHeaderProps {
  navbar?: boolean;
}

function StudentHeader({ navbar }: StudentHeaderProps) {
  const navigate = useNavigate();

  return (
    <HeaderLayout>
      <Header>
        <HeaderLogo>
          <img src="/images/headerLogo.svg" />
        </HeaderLogo>

        {navbar ? (
          <Navbar>
            <button>지갑</button>
            <button>종목</button>
            <button>뉴스</button>
          </Navbar>
        ) : (
          <GoBack>
            <img
              src="/icons/arrow-left_icon.svg"
              onClick={() => {
                navigate(-1);
              }}
            />
            <p>A 엔터</p>
          </GoBack>
        )}
      </Header>
    </HeaderLayout>
  );
}

const GoBack = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 9px 0;
  position: relative;

  & > img {
    position: absolute;
    left: 7px;
    cursor: pointer;
  }

  & > p {
    color: #ffffff;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const HeaderLogo = styled.div`
  margin-top: 42px;
  padding: 25px 0;
`;

const HeaderLayout = styled.header`
  width: 100%;
  background: linear-gradient(
    108deg,
    #3f51b5 4.42%,
    #00bcd4 99.95%,
    #03a9f4 99.95%
  );
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
`;

const Navbar = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  & > button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% / 3);
    background: none;
    color: #ffffff;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    padding: 9px 0px;
    white-space: nowrap;
    cursor: pointer;

    &:nth-child(1) {
      border-radius: 0 8px 0 0;
    }

    &:nth-child(2) {
      border-radius: 8px 8px 0 0;
    }

    &:nth-child(3) {
      border-radius: 8px 0 0 0;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

export default StudentHeader;
