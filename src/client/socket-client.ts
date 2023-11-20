import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { SerialPort, SerialPortMock } from 'serialport';
import Logger from '../utils/logger';

export const socketClientLogger = new Logger('socketio-client')

export function createSocketClient(url: string, serialPort: SerialPort | SerialPortMock): Socket {
  const socket = io(url);

  function sendToSerial(s: string) {
    serialPort.write(s+'\n')
  }
  function handleConnect() {
    socketClientLogger.log('Connected to the server on ' + url);
  }

  function handleError(error: any) {
    socketClientLogger.error('Socket.io error: ' + error);
  }

  function handleDisconnect() {
    socketClientLogger.log('Disconnected from the server');
  }
  const newlineChar = String.fromCharCode(10);
  function handleGameState(gameState: any) {
    socketClientLogger.log('GameState: ' + gameState);
    sendToSerial(gameState)
  }

  function handleGameQuestion(question: any) {
    socketClientLogger.log('Question: ' + question);
    sendToSerial(question)
  }

  socket.on('connect', handleConnect);
  socket.on('error', handleError);
  socket.on('disconnect', handleDisconnect);
  socket.on('GameState', handleGameState);
  socket.on('GameQuestion', handleGameQuestion);

  return socket;
}
