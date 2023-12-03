import 'dotenv/config'
import { createSerialPort } from './client/serial';
import {config} from './utils/utils'
import { createExpressServer } from './server/server';
import { createSocketServer } from './server/socket';
import KashootController from './client/KashootController';
import KashootControllerSocket from './client/KashootControllerSocket';

 if (process.env.SERIALPORT) {
   const port = createSerialPort(process.env.SERIALPORT)
   new KashootController(port, "http://localhost:5000")
 }

const httpServer = createExpressServer(config.port)
export const io = createSocketServer(httpServer);
const kashootSocket = new KashootControllerSocket(8000);
kashootSocket.startServer();