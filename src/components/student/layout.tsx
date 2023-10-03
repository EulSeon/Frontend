import React from 'react';
import { styled } from 'styled-components';

interface StudentLayoutProps {
  children?: React.ReactNode;
}

function StudentLayout_({ children }: StudentLayoutProps) {
  return <StudentLayout>{children}</StudentLayout>;
}

const StudentLayout = styled.div`
  width: 100%;
  height: auto;
  overflow: hidden;
  background-color: #ececec;
  position: relative;
`;

export default StudentLayout_;
