import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../utils/utils';
import Game from '../game/Game'
import Logger from '../utils/logger';

export const socketLogger = new Logger('socketio-server')

export function createSocketServer(httpServer: HttpServer) {

    const io = new Server(httpServer, config);
    socketLogger.log('Ready!')
    interface Question {
        question: string;
        answers: string[];
        correctAnswer: number;
        id: number;
    }
    io.on('connection', (socket: Socket) => {
        socket.on('joinGame', (roomId) => {
            joinOrCreateGame(socket, roomId)
        })
})
    return io;
}
function joinOrCreateGame(socket: Socket, roomId: string) {
    throw new Error('Function not implemented.');
}

