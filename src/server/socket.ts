import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../utils/utils';
import {handleConnection, handleAnswer, handleDisconnect, joinOrCreateGame, startGame, getGameBySocket, } from '../game/game'
import Logger from '../utils/logger';

export enum Events {
    connection = 'connection',
    disconnect = 'disconnect',
    joinGame = 'joinGame',
    reqGameStart = 'gameStartReq',
    gameAnswer = 'gameAnswer',
    gameState = 'gameState',
    getGameState = 'getGameState',
    gameQuestion = 'gameQuestion',
    questionCorrect = 'questionCorrect',
    questionIncorrect = 'questionIncorrect',
    gameWin = 'gameWin'
}
export const socketLogger = new Logger('socketio-server')

export function createSocketServer(httpServer: HttpServer) {

    const io = new Server(httpServer, config);
    socketLogger.log('Ready!')

    io.on(Events.connection, (socket: Socket) => {
        handleConnection(socket)
        socket.on(Events.disconnect, () => {
            handleDisconnect(socket)
        });
        socket.on(Events.joinGame, (roomId) => {
            joinOrCreateGame(socket, io, roomId)
        })
        socket.on(Events.reqGameStart, () => {
            socketLogger.log(`Got GameStartReq from ${socket.id}`)
            startGame(socket, io)
        });
        socket.on(Events.gameAnswer, (e) => {
            handleAnswer(socket, e, io)
        });
        socket.on(Events.getGameState, () => {
            socket.emit(Events.gameState, getGameBySocket(socket).gameState)
        })
})
    return io;
}
