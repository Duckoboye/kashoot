import io from 'socket.io-client';
import { socketClientLogger } from '..';
import { Socket } from 'socket.io-client';
import { type SerialPort } from 'serialport';

export function createSocketClient(url: string, serialPort: SerialPort): Socket {
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
  socket.on('GameState', (gameState) => {
    socketClientLogger.log('GameState: '+gameState);
    serialPort.write(gameState);
  });
  socket.on('GameQuestion', (question) => {
    socketClientLogger.log('Question: '+question);
    serialPort.write(question);
  })
  return socket
}
