import net, { Socket as NetSocket } from 'net';
import Logger from '../utils/logger';

class KashootControllerSocket {
  private server: net.Server;
  private logger: Logger;

  constructor(private socketPort: number) {
    this.server = net.createServer();
    this.logger = new Logger('KashootControllerSocket');
  }

  startServer(): void {
    this.server.on('connection', (socket: NetSocket) => {
      this.logger.log('Client connected to server.');

      socket.on('data', (data: Buffer) => {
        const receivedData = data.toString();
        this.logger.log('Received data:'+receivedData);
        socket.write(receivedData) // mirror what the client sends
      });

      socket.on('end', () => {
        this.logger.log('Client disconnected.');
      });

      socket.on('error', (err: Error) => {
        this.logger.error('Socket error:'+err.message);
      });
    });

    this.server.listen(this.socketPort, () => {
      this.logger.log(`Server is listening on port ${this.socketPort}`);
    });
  }

  stopServer(): void {
    this.server.close(() => {
      this.logger.log('Server closed.');
    });
  }
}

export default KashootControllerSocket;
