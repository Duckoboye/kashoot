const express = require('express');
const cors = require('cors')
const utils = require('./serverUtils')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const initializeSocket = require('./socket');

app.use(cors())

const io = initializeSocket(server);

app.get('/', (req, res) => {
  res.send('API')
})

app.post('/api/generatecode', (req, res) => {
  
  res.send(utils.api.generateCode(6))
})

server.listen(utils.config.port, () => {
  utils.log.express(`API server listening on http://127.0.0.1:${utils.config.port}`);
});

module.exports = {io, server}