import { createSocketServer } from './server/socket';
import { httpServer } from './server/server'
import { config } from './utils/utils';
import Logger from './utils/logger'
import { createSerialServer } from './client/serial';

//Loggers
export const expressLogger = new Logger('express')
export const socketLogger = new Logger('socketio-server')
export const socketClientLogger = new Logger('socketio-client')
export const serialLogger = new Logger('serial')

export const io = createSocketServer(httpServer);
if (process.env.SERIALPORT){
  createSerialServer(process.env.SERIALPORT)
} else {serialLogger.warn('No SERIALPORT in .env found, serial functionality will be disabled.')}
httpServer.listen(config.port, () => {
    expressLogger.log(`API server listening on http://127.0.0.1:${config.port}`);
  });
