const { Server } = require('socket.io');
const utils = require('./serverUtils')

function initializeSocket(server) {
    const io = new Server(server, utils.config.cors);

    io.on('connection', (socket) => {
        utils.log.socketio('a user connected');
        socket.on('disconnect', () => {
            utils.log.socketio('a user disconnected');
        });
        socket.on('chat message', (msg) => {
            utils.log.socketio('message: ' + msg);
        });
        socket.on('GameStartReq', () => {
            utils.log.socketio('Received GameStartReq, broadcasting GameStarting event to all clients.')
            io.emit('GameStarting', 'wow sample text, this will send the amount of players and some other fun info later')
            setTimeout(() => {
            utils.log.socketio('timeout elapsed, sending first Question..')
            io.emit("GameQuestion", {"question": "Bla bla bla, test", "answers": [{"id": 1, "answer": "bla bla svar 1"}, {"id": 2, "answer": "bla bla svar 2"}, {"id": 3, "answer": "bla bla svar 3"}, {"id": 4, "answer": "blas ba svar 4"}]})
            }, 5000)
        })
    });
  return io;
}

module.exports = initializeSocket;