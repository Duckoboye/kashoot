import {
    expect
} from 'chai';
import {
    type Server
} from 'socket.io'
import {
    io as ioc,
    type Socket as ClientSocket
} from "socket.io-client";
import {
    io as ios
} from '../src/index'
import {
    config
} from '../src/utils/utils'

describe('Socket.io Game Tests', () => {
    let io: Server = ios;
    let clientSocket: ClientSocket;
    let roomId: string;

    before((done) => {

        const port = config.port;
        clientSocket = ioc(`http://localhost:${port}`);
        clientSocket.on('connect', done);
    });

    after(() => {
        clientSocket.disconnect();
        io.close();
    });

    it('should allow a user to join or create a game', (done) => {
        roomId = 'room123'; // Replace with your room ID logic
        clientSocket.emit('joinGame', roomId);
        setTimeout(done, 100);
    });

    it('should start a game when requested', (done) => {
        clientSocket.emit('GameStartReq');

        clientSocket.once('GameState', (gameState) => {
            expect(gameState).to.equal('starting');
        })
        setTimeout(() => {
            clientSocket.once('GameState', (gameState) => {
                expect(gameState).to.equal('running');
                done()
            })
        }, 10)
    });

    it('should handle user disconnection', (done) => {
        clientSocket.disconnect();
        setTimeout(done, 100);
    });
});