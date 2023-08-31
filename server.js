const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const utils = require('./serverutils')

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

////socket io shit
io.on('connection', (socket) => {
  utils.log.socketio('a user connected');
  socket.on('disconnect', () => {
    utils.log.socketio('a user disconnected');
  });
  socket.on('chat message', (msg) => {
    utils.log.socketio('message: ' + msg);
  });
});

//start server
server.listen(port, () => {
  utils.log.express(`API server listening on http://127.0.0.1:${port}`);
});
