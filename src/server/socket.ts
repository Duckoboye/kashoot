import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../utils/utils';
import {handleConnection, handleAnswer, handleDisconnect, joinOrCreateGame, startGame, getGameBySocket, } from '../game/game'
import Logger from '../utils/logger';

export const socketLogger = new Logger('socketio-server')

export function createSocketServer(httpServer: HttpServer) {

    const io = new Server(httpServer, config);
    socketLogger.log('Ready!')

    io.on('connection', (socket: Socket) => {
        handleConnection(socket)

        socket.on('disconnect', () => {
            handleDisconnect(socket)
        });
        socket.on('joinGame', (roomId) => {
            joinOrCreateGame(socket, io, roomId)
        })
        socket.on('GameStartReq', () => {
            socketLogger.log(`Got GameStartReq from ${socket.id}`)
            startGame(socket, io)
        });
        socket.on('GameAnswer', (e) => {
            handleAnswer(socket, e, io)
        });
        socket.on('getGameState', () => {
            socket.emit('gameState', getGameBySocket(socket).gameState)
        })
})
    return io;
}
