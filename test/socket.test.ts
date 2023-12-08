import { createServer } from 'http';
import { AddressInfo } from 'net';
import { io as ioc, Socket as ClientSocket } from 'socket.io-client';
import { Server, Socket as ServerSocket } from 'socket.io';
import { assert, expect } from 'chai';
import { Events, createSocketServer } from '../src/server/socketio';

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}

describe('Socket Server', () => {
    let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;
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

    it('should emit "hello" event from server and receive on client', (done) => {
        clientSocket.once('hello', (arg) => {
            assert.equal(arg, 'world');
            done();
        });
        serverSocket.emit('hello', 'world');
    });

    it('should use waitFor() to ensure event emission', async () => {
        const waitForEvent = waitFor(clientSocket, 'baz');
        serverSocket.emit('baz');
        return await waitForEvent;
    });

    it('should request game start and receive the game start event', (done) => {
          clientSocket.once('gameStart', (quizName) => {
            assert.equal(quizName, 'testGame');
            done();
          });
      
        clientSocket.emit('joinGame', { username: 'testUser', roomCode: roomCode });
        clientSocket.emit(Events.reqGameStart, roomCode);
      });
    it('should send question', (done) => {
        clientSocket.once(Events.gameQuestion, (questionData) => {
            console.log(questionData)
            expect(questionData).to.exist;
            done()
        });
    })
    it('should handle correct answers',(done) => {
        clientSocket.once(Events.questionCorrect, () => {
            done()
        });
        clientSocket.emit(Events.gameAnswer, {roomCode: roomCode, answerId: 0})
    })
    it('should handle incorrect answers',(done) => {
        clientSocket.once(Events.questionIncorrect, () => {
            done()
        });
        clientSocket.emit(Events.gameAnswer, {roomCode: roomCode, answerId: 1})
    })
});
