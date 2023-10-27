import { io } from 'socket.io-client';

export const socket = io('http://localhost:8000');

export const registerSocket = () => {
  socket.on('connect', () => {
    console.log('connection server');
  });
};
