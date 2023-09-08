/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { styled } from 'styled-components';

interface ButtonInfoProps {
  button1: {
    value: string;
    onClick: () => void;
  };
  button2?: {
    value: string;
    onClick: () => void;
  };
}

interface ListLayoutProps {
  title: string;
  src?: string;
  buttons?: boolean;
  buttonInfo: ButtonInfoProps;
  children?: React.ReactNode;
}

function ListLayout_({
  title,
  src,
  buttons = false,
  buttonInfo,
  children,
}: ListLayoutProps) {
  return (
    <ListLayout>
      <Title>
        <img src={src} />
        <h2>{title}</h2>
      </Title>
      <List>{children}</List>
      <Buttons>
        {buttons ? (
          <>
            <Button onClick={buttonInfo.button1.onClick}>
              {buttonInfo.button1.value}
            </Button>
            <Button>{buttonInfo.button2?.value}</Button>
          </>
        ) : (
          <>
            <Button onClick={buttonInfo.button1.onClick}>
              {buttonInfo.button1.value}
            </Button>
          </>
        )}
      </Buttons>
    </ListLayout>
  );
}

const Buttons = styled.div`
  display: flex;
`;

const Button = styled.button`
  width: 100%;
  height: 80px;
  padding: 20px 59px;
  color: #ffffff;
  font-size: 3.2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  -moz-transition: background, 0.3s;
  -o-transition: background, 0.3s;
  -webkit-transition: background, 0.3s;
  transition: background, 0.3s;

  &:hover {
    border-radius: 25px;
    background: #a7c2e4;
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  }
`;

const ListLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 88px);
  min-height: 800px;
  max-height: 1000px;
  gap: 27px;
  padding-top: 3vh;
  padding-bottom: 5vh;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
  gap: 16px;

  & > img {
    width: 32px;
    height: 32px;
  }

  & > h2 {
    color: #ffffff;
    font-size: 2rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  margin-bottom: auto;
  padding: 37px 33px;
  position: relative;
  overflow: hidden;
  border-radius: 25px;
`;

export default ListLayout_;
