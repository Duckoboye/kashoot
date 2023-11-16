import 'dotenv/config'
import { createSerialPort, createSerialServer } from './client/serial';
import {config} from './utils/utils'
import { createExpressServer } from './server/server';
import { createSocketServer } from './server/socket';

if (process.env.SERIALPORT) {
  createSerialServer(createSerialPort(process.env.SERIALPORT))
}
const httpServer = createExpressServer(config.port)
export const io = createSocketServer(httpServer);
