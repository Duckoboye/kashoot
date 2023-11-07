import { createSocketServer } from './server/socket';
import { httpServer } from './server/server'
import { config } from './utils/utils';
import Logger from './utils/logger'
import { createSocketClient } from './client/socket-client';
import { createSerialServer } from './client/serial';

//Loggers
export const expressLogger = new Logger('express')
export const socketLogger = new Logger('socketio-server')
export const socketClientLogger = new Logger('socketio-client')
export const serialLogger = new Logger('serial')

export const io = createSocketServer(httpServer);
export const ioc = createSocketClient('http://localhost:5000')
export const serial = createSerialServer('COM7')
httpServer.listen(config.port, () => {
    expressLogger.log(`API server listening on http://127.0.0.1:${config.port}`);
  });
