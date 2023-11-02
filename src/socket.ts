import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BackEndUrl;

export const socket = io(`${SOCKET_URL}`);

export const registerSocket = () => {
  socket.on('connect', () => {
    console.log('connection server');
  });
};
