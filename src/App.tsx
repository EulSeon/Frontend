import React from 'react';
import GlobalStyle from '../src/styles/GlobalStyle';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes></Routes>
      </Router>
    </>
  );
}

export default App;
