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
      <List $title={title}>{children}</List>
      <Buttons>
        {buttons ? (
          <>
            <TwoButton onClick={buttonInfo.button1.onClick}>
              {buttonInfo.button1.value}
            </TwoButton>
            <TwoButton onClick={buttonInfo.button2?.onClick}>
              {buttonInfo.button2?.value}
            </TwoButton>
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

  @media screen and (max-width: 768px) {
    gap: 15px;
    padding-bottom: 2vh;
  }
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

  @media screen and (max-width: 768px) {
    & > img {
      width: 20px;
      height: 20px;
    }

    & > h2 {
      font-size: 1.5rem;
    }
  }
`;

const List = styled.div<{ $title: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  margin-bottom: auto;
  padding: ${(props) =>
    props.$title === '결과 조회' ? '37px 21px' : '37px 33px'};
  position: relative;
  border-radius: 25px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 29px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const TwoButton = styled.button`
  width: 274px;
  height: 49px;
  color: #ffffff;
  font-size: 2rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  -moz-transition: background, 0.3s;
  -o-transition: background, 0.3s;
  -webkit-transition: background, 0.3s;
  transition: background, 0.3s;
  cursor: pointer;

  &:hover {
    border-radius: 25px;
    background: #a7c2e4;
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  }

  @media screen and (max-width: 768px) {
    width: 100%;
  }
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
  cursor: pointer;

  &:focus {
    background-color: #a7c2e4;
  }

  &:hover {
    border-radius: 25px;
    background: #a7c2e4;
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  }
`;

export default ListLayout_;
