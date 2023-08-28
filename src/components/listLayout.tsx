import React from 'react';
import { styled } from 'styled-components';

interface ListLayoutProps {
  title: string;
  src?: string;
  children?: React.ReactNode;
}

function ListLayout_({ title, src, children }: ListLayoutProps) {
  return (
    <ListLayout>
      <Title>
        <img src={src} />
        <h2>{title}</h2>
      </Title>
      <List>{children}</List>
    </ListLayout>
  );
}

const ListLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 88px);
  min-height: 700px;
  max-height: 1000px;
  gap: 20px;
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
  height: 80%;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  margin-bottom: auto;
  padding: 37px 33px;
  position: relative;
  overflow: hidden;
  border-radius: 25px;
`;

export default ListLayout_;
