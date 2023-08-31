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
});


server.listen(utils.config.port, () => {
  utils.log.express(`API server listening on http://127.0.0.1:${utils.config.port}`);
});

module.exports = {io, server}