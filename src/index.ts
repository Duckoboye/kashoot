import 'dotenv/config'
import { config } from './utils/utils'
import { createExpressServer } from './server/express';
import { createSocketServer } from './server/socketio';
import KashootSocketBridge from './client/KashooterSocketBridge';

const httpServer = createExpressServer(config.port)
export const io = createSocketServer(httpServer);

const socket = KashootSocketBridge(8000, `http://localhost:${config.port}`);
socket.startServer()