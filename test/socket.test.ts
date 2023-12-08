import { Server } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { io as ioc, Socket as ClientSocket } from 'socket.io-client';
import { assert } from 'chai';
import {
    ClientToServerEvents,
    ServerToClientEvents,
    lobbies,
    createSocketServer,
} from '../src/server/socketio';

describe('Socket Server', () => {
    let io: Server;
    let clientSocket: ClientSocket<ServerToClientEvents, ClientToServerEvents>;
    let server: HttpServer;

    before((done) => {
        server = createServer();
        io = createSocketServer(server);

        server.listen(() => {
            const { port } = server.address() as AddressInfo;
            clientSocket = ioc(`http://localhost:${port}`);
            clientSocket.once('connect', done);
        });
    });

    after(() => {
        io.close();
        clientSocket.disconnect();
        server.close();
    });

    it('should allow a user to join a game', (done) => {
        clientSocket.once('playerList', (playerList) => {
            assert.isArray(playerList);
            assert.isNotEmpty(playerList);
            done();
        });
        clientSocket.emit('joinGame', 'TestUser', 'TestRoom');
    });

    it('should set ready state for a player', (done) => {
        const roomCode = 'TestRoom';
        const isReady = true;

        clientSocket.once('playerList', (playerList) => {
            const player = playerList.find((player: { username: string; }) => player.username === 'TestUser');
            assert.isDefined(player);
            assert.equal(isReady, player?.isReady)
            done();
        });
        clientSocket.emit('readyState', roomCode, isReady)
    });
    it('should start a game when requested', (done) => {
        clientSocket.once('gameStart', (quizName) => {
            assert.strictEqual(quizName, 'testGame');
            done();
        });
        clientSocket.emit('gameStartReq', 'TestRoom');
    });

    it('should handle game question', (done) => {
        clientSocket.once('gameQuestion', (question, alternatives) => {
            assert.isString(question);
            assert.isArray(alternatives);
            assert.isNotEmpty(alternatives);
            done();
        });
    });

    // Add more test cases as needed
});
