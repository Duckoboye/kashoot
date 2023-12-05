import net, { Socket as NetSocket, Socket } from 'net';
import KashootClient from './KashootClient';

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
class KashootControllerSocket extends KashootClient {
  private server: net.Server;

  constructor(private socketPort: number, private socketUrl: string) {
    super(socketUrl, `KashootClient-${socketPort}`);
    this.server = net.createServer();
    this.startServer()

  }
  close() {
    super.close();
  }

  startServer(): void {
    this.server.on('connection', (socket) => this.handleConnection(socket))
    this.server.listen(this.socketPort, () => {
      this.logger.log(`Server is listening on port ${this.socketPort}`);
    });
  }

  private handleData(socket: Socket, data: Buffer) {
    console.log(data);
    const ControlByte = data[0];
    socket.write(data)
    console.log("ControlByte:" + ControlByte);

    switch (ControlByte) {
      case ControlBytes.TriggerButtonPressed:
        this.sendGameStartReq()
        break;

      case ControlBytes.GreenButtonPressed:
        this.answerQuestion(0)
        break;
      case ControlBytes.YellowButtonPressed:
        this.answerQuestion(1)
        break;
      case ControlBytes.RedButtonPressed:
        this.answerQuestion(2)
        break;
      case ControlBytes.BlueButtonPressed:
        this.answerQuestion(3)
        break;

      default:
        console.log(ControlByte);
        break;
    }
  }
  private handleConnection(socket: NetSocket): void {
    this.socket.connect()
    socket.write(new Uint8Array([ControlBytes.JoinedGame]))

    socket.on('data', (data) => this.handleData(socket, data));

    socket.on('end', () => {
      this.logger.log('Client disconnected.');
    });

    socket.on('error', (err: Error) => {
      this.logger.error('Socket error:' + err.message);
    });
  }

  stopServer(): void {
    this.server.close(() => {
      this.logger.log('Server closed.');
    });
  }
}

export default KashootControllerSocket;
