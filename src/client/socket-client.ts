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
    socket.emit('joinGame', 'bla123');
  }

  function handleError(error: any) {
    socketClientLogger.error('Socket.io error: ' + error);
  }

  function handleDisconnect() {
    socketClientLogger.log('Disconnected from the server');
  }
  
  function handleGameState(gameState: any) {
    socketClientLogger.log('GameState: ' + gameState);
    sendToSerial(gameState)
  }

  function handleGameQuestion(question: any) {
    socketClientLogger.log('Question: ' + question);
    sendToSerial(question)
  }
  function handleQuestionIncorrect(question: string) {
    socketClientLogger.log('Incorrect :(');
    sendToSerial('placeholder-incorrect')
  }

  function handleQuestionCorrect(question: string) {
    socketClientLogger.log('Correct :D');
    sendToSerial('placeholder-correct')
  }

  socket.on('connect', handleConnect);
  socket.on('error', handleError);
  socket.on('disconnect', handleDisconnect);
  socket.on('GameState', handleGameState);
  socket.on('GameQuestion', handleGameQuestion);
  socket.on('questionIncorrect', handleQuestionIncorrect);
  socket.on('questionCorrect', handleQuestionCorrect);

  return socket;
}
