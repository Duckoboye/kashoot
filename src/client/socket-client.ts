import io from 'socket.io-client';
import { socketClientLogger } from '..';
import { Socket } from 'socket.io-client';

export function createSocketClient(url: string): Socket {
  const socket = io(url);

  socket.on('connect', () => {
    socketClientLogger.log('Connected to the server on '+url);
  });
  
  socket.on('error', (error: any) => {
    socketClientLogger.error('Socket.io error: '+ error);
  });
  
  socket.on('disconnect', () => {
    socketClientLogger.log('Disconnected from the server');
  });
  return socket
}
