import express, {Request, Response} from 'express';
import cors from 'cors';
import {generateCode, config} from './utils';
const app = express();
import {createServer} from 'http';
const server = createServer(app);
import initializeSocket from './socket';
import Logger from './logger'

//Loggers
export const expressLogger = new Logger('express')
export const socketLogger = new Logger('socketio')

app.use(cors())

const io = initializeSocket(server);

app.get('/', (req, res) => {
  res.send('API')
})

app.post('/api/generatecode', (req: Request, res: Response) => {
  
  res.send(generateCode(6))
})

server.listen(config.port, () => {
  expressLogger.log(`API server listening on http://127.0.0.1:${config.port}`);
});

module.exports = {io, server}