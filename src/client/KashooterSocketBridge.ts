import net, { Socket as NetSocket, Socket } from 'net';
import KashootClient from './KashootClient';
import Logger from '../utils/logger';

export enum ControlBytes {
  //Game
  JoinedGame = 0b00100000,
  GameState = 0b00100001,
  Question = 0b00100010,
  AnswerResults = 0b00100011,
  Winner = 0b00100100,

  //inputs
  GreenButtonPressed = 0b01000000,
  YellowButtonPressed = 0b01000001,
  RedButtonPressed = 0b01000010,
  BlueButtonPressed = 0b01000011,
  TriggerButtonPressed = 0b01000100
}



const KashootSocketBridge = (socketPort: number, socketUrl: string) => {
  const server = net.createServer();
  const logger = new Logger('KashooterSocketBridge');

  const startServer = (): void => {
    server.on('connection', (socket) => handleConnection(socket));
    server.listen(socketPort, () => {
      logger.log(`Server is listening on port ${socketPort}`);
    });
  };

  const handleData = (socket: Socket, client: KashootClient, data: Buffer): void => {
    const controlByte = data[0];
    socket.write(data);

    const controlByteActions: Record<number, () => void> = {
      [ControlBytes.TriggerButtonPressed]: () => client.sendGameStartReq(),
      [ControlBytes.GreenButtonPressed]: () => client.answerQuestion(0),
      [ControlBytes.YellowButtonPressed]: () => client.answerQuestion(1),
      [ControlBytes.RedButtonPressed]: () => client.answerQuestion(2),
      [ControlBytes.BlueButtonPressed]: () => client.answerQuestion(3),
    }

    const action = controlByteActions[controlByte];
    if (action) action();
    else logger.warn('Client sent unrecognized option ' + controlByte);
  };

  const handleConnection = (socket: NetSocket): void => {
    const client = new KashootClient(socketUrl, `KashootClient-${socketPort}`);
    client.connect();

    socket.write(new Uint8Array([ControlBytes.JoinedGame]));

    socket.on('data', (data) => handleData(socket, client, data));

    socket.on('end', () => {
      logger.log('Client disconnected.');
      client.disconnect();
    });

    socket.on('error', (err: Error) => {
      logger.error('Socket error:' + err.message);
      client.disconnect();
    });
  };

  const stopServer = (): void => {
    server.close(() => {
      logger.log('Server closed.');
    });
  };

  return {
    // Functions to expose
    startServer,
    stopServer,
    
  };
};

export default KashootSocketBridge;