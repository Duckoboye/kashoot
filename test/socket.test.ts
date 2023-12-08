import { createServer } from 'http';
import { AddressInfo } from 'net';
import { io as ioc, Socket as ClientSocket } from 'socket.io-client';
import { Server, Socket as ServerSocket } from 'socket.io';
import { assert, expect } from 'chai';
import { createSocketServer, ClientToServerEvents, ServerToClientEvents } from '../src/server/socketio';

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}

describe('Socket Server', () => {
    let io: Server, serverSocket: ServerSocket<ClientToServerEvents, ServerToClientEvents>, clientSocket: ClientSocket<ServerToClientEvents, ClientToServerEvents>;
    const roomCode = 'testRoom'
    before((done) => {
        const httpServer = createServer();
        io = createSocketServer(httpServer);
        

        httpServer.listen(() => {
            const { port } = httpServer.address() as AddressInfo;
             clientSocket = ioc(`http://localhost:${port}`);
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
    });

    after(() => {
        io.close();
        clientSocket.disconnect();
    });
    it('should request game start and receive the game start event', (done) => {
          clientSocket.once('gameStart', (quizName) => {
            assert.equal(quizName, 'testGame');
            done();
          });
      
        clientSocket.emit('joinGame', 'testUser', roomCode);
        clientSocket.emit('gameStartReq', roomCode);
      });
    it('should send question', (done) => {
        clientSocket.once('gameQuestion', (questionData) => {
            console.log(questionData)
            expect(questionData).to.exist;
            done()
        });
    })
    it('should handle correct answers',(done) => {
        clientSocket.once('questionCorrect', () => {
            done()
        });
        clientSocket.emit('gameAnswer', roomCode, 0)
    })
    it('should handle incorrect answers',(done) => {
        clientSocket.once('questionIncorrect', () => {
            done()
        });
        clientSocket.emit('gameAnswer', roomCode, 1)
    })
});
