import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000'; 

export const socket = io(URL);

export const Events = {
    connection: 'connection',
    disconnect: 'disconnect',
    joinGame: 'joinGame',
    reqGameStart: 'gameStartReq',
    gameAnswer: 'gameAnswer',
    gameState: 'gameState',
    getGameState: 'getGameState',
    gameQuestion: 'gameQuestion',
    questionCorrect: 'questionCorrect',
    questionIncorrect: 'questionIncorrect',
    gameWin: 'gameWin'
  }