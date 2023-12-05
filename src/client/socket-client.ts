import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { SerialPort, SerialPortMock } from 'serialport';
import Logger from '../utils/logger';
import { Events } from '../server/socketio';
export const socketClientLogger = new Logger('socketio-client')

export function createSocketClient(url: string, serialPort: SerialPort | SerialPortMock): Socket {
  const socket = io(url);

  function sendToSerial(s: string) {
    serialPort.write(s+'\n')
  }
  function handleConnect() {
    socketClientLogger.log('Connected to the server on ' + url);
    socket.emit(Events.joinGame, 'bla123');
  }

  function handleError(error: any) {
    socketClientLogger.error('Socket.io error: ' + error);
  }

  function handleDisconnect() {
    socketClientLogger.log('Disconnected from the server');
  }
  
  function handleGameState(gameState: string) {
    socketClientLogger.log('GameState: ' + gameState);
    if (gameState === 'finished') return handleGameEnd();
    sendToSerial(gameState)
  }
  function handleGameEnd() {
    socketClientLogger.log('Game is over!');
    sendToSerial('game ended')
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

  function handleWinner(winner: string) {
    if (winner === socket.id) {
      socketClientLogger.log('you won!')
      sendToSerial('placeholder-you-won')
    }
    else {
      sendToSerial('placeholder-you-lost')
    }
  }

  socket.on('connect', handleConnect);
  socket.on('error', handleError);
  socket.on('disconnect', handleDisconnect);
  socket.on(Events.gameState, handleGameState);
  socket.on(Events.gameQuestion, handleGameQuestion);
  socket.on(Events.questionIncorrect, handleQuestionIncorrect);
  socket.on(Events.questionCorrect, handleQuestionCorrect);
  socket.on(Events.gameWin, handleWinner)

  return socket;
}
