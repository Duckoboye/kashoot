import 'dotenv/config'
import Logger from './utils/logger'
import { createSerialPort, createSerialServer } from './client/serial';
import {config} from './utils/utils'
import { createExpressServer } from './server/server';

//Loggers
export const socketLogger = new Logger('socketio-server')


if (process.env.SERIALPORT) {
  createSerialServer(createSerialPort(process.env.SERIALPORT))
}
export const io = createExpressServer(config.port)