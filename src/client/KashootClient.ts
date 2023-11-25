import { type Socket, io } from 'socket.io-client';
import Logger from '../utils/logger';
import { Events } from '../server/socket';

class KashootClient {
  protected socket: Socket;
  protected logger: Logger;

  constructor(private url: string, private label: string) {
    this.socket = io(url);
    this.logger = new Logger(this.label)

    this.socket.on('connect', () => this.handleConnect());
    this.socket.on('error', (error) => this.handleError(error));
    this.socket.on('disconnect', () => this.handleDisconnect());
    this.socket.on(Events.gameState, (gameState) => this.handleGameState(gameState));
    this.socket.on(Events.gameQuestion, (question) => this.handleGameQuestion(question));
    this.socket.on(Events.questionIncorrect, () => this.handleQuestionIncorrect());
    this.socket.on(Events.questionCorrect, () => this.handleQuestionCorrect());
    this.socket.on(Events.gameWin, (winner) => this.handleWinner(winner));
  }

  handleConnect() {
    this.logger.log('Connected to the server on ' + this.url);
    this.socket.emit(Events.joinGame, 'bla123');
  }

  handleError(error: any) {
    this.logger.error('Socket.io error: ' + error);
  }

  handleDisconnect() {
    this.logger.log('Disconnected from the server');
  }
  
  handleGameState(gameState: string) {
    this.logger.log('GameState: ' + gameState);
    if (gameState === 'finished') return this.handleGameEnd();
  }
  handleGameEnd() {
    this.logger.log('Game is over!');
  }
  handleGameQuestion(question: any) {
    this.logger.log('Question: ' + question);
  }
  handleQuestionIncorrect() {
    this.logger.log('Incorrect :(');
  }

  handleQuestionCorrect() {
    this.logger.log('Correct :D');
  }

  handleWinner(winner: string) {
    if (winner === this.socket.id) {
      this.logger.log('you won!')
    }
  }
  public sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}

export default KashootClient;
