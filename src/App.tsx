import React from 'react';
import GlobalStyle from '../src/styles/GlobalStyle';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Main_ from '@pages/Main';
import WaitingRoomLayout from '@pages/WaitingRoom';
import GameResult from '@pages/GameResult';

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Main_ />}></Route>
          <Route path="/room/wait" element={<WaitingRoomLayout />}></Route>
          <Route path="/room/1/result" element={<GameResult />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
