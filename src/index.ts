import initializeSocket from './server/socket';
import { httpServer } from './server/server'
import { config } from './utils/utils';
import Logger from './utils/logger'

//Loggers
export const expressLogger = new Logger('express')
export const socketLogger = new Logger('socketio')

initializeSocket(httpServer);
httpServer.listen(config.port, () => {
    expressLogger.log(`API server listening on http://127.0.0.1:${config.port}`);
  });