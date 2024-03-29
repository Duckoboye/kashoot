import express from 'express';
import cors from 'cors';
import {createServer} from 'http';
import Logger from '../utils/logger';

export const expressLogger = new Logger('express')

export function createExpressServer(port: number) {
    const app = express();
    const httpServer = createServer(app);
    app.use(cors())
    
    httpServer.listen(port, () => {
        expressLogger.log(`API server listening on http://127.0.0.1:${port}`);
      });
    return httpServer;
}