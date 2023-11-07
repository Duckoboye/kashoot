import io from 'socket.io-client';
import { ioc, socketClientLogger } from '..';

export function createSocketClient(url: string) {
  const socket = io();

  socket.on('connect', () => {
    socketClientLogger.log('Connected to the server on '+url);
  });
  
  socket.on('error', (error: any) => {
    socketClientLogger.error('Socket.io error: '+ error);
  });
  
  socket.on('disconnect', () => {
    socketClientLogger.log('Disconnected from the server');
  });
}
