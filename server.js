const express = require('express');
const cors = require('cors')
const utils = require('./serverUtils')

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, utils.config.cors);

app.use(cors())

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
    socket.broadcast.emit('GameStarting', 'wow sample text, this will send the amount of players and some other fun info later')
    setTimeout(() => {
      utils.log.socketio('timeout elapsed, sending first Question..')
      socket.broadcast.emit("GameQuestion", {"question": "Bla bla bla, test", "answers": [{"id": 1, "answer": "bla bla svar 1"}, {"id": 2, "answer": "bla bla svar 2"}, {"id": 3, "answer": "bla bla svar 3"}, {"id": 4, "answer": "blas ba svar 4"}]})
    }, 5000)
  })
});

app.get('/', (req, res) => {
  res.send('API')
})


server.listen(utils.config.port, () => {
  utils.log.express(`API server listening on http://127.0.0.1:${utils.config.port}`);
});

module.exports = {io, server}