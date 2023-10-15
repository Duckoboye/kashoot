import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../utils/utils';
import {handleConnection, handleAnswer, handleDisconnect, joinOrCreateGame, startGame, getGameBySocket, } from '../game/game'

export function createSocketServer(httpServer: HttpServer) {

    const io = new Server(httpServer, config);

    io.on('connection', (socket: Socket) => {
        handleConnection(socket)

        socket.on('disconnect', () => {
            handleDisconnect(socket)
        });
        socket.on('joinGame', (roomId) => {
            joinOrCreateGame(socket, roomId)
        })
        socket.on('GameStartReq', () => {
            startGame(socket)
        });
        socket.on('GameAnswer', (e) => {
            handleAnswer(socket, e)
        });
        socket.on('getGameState', () => {
            socket.emit('gameState', getGameBySocket(socket).gameState)
        })
})
    return io;
}
