import { SerialPort, SerialPortMock } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import KashootClient from './KashootClient';
import Logger from '../utils/logger';

class KashootController extends KashootClient {
  private gameStarted: boolean = false;
  

  constructor(private port: SerialPort | SerialPortMock, private socketUrl: string) {
    super(socketUrl, `KashootClient-${port.path}`);
    this.port = port;
    this.setupSerialServer();
  }

  close() {
    super.close();
  }

  private setupSerialServer(): void {
    const parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

    parser.on('data', (line: string) => this.handleDataReceived(line));

    this.port.on('open', () => this.handlePortOpen());

    this.port.on('error', (err: Error) => this.handleError(err));
  }

    private handleDataReceived(line: string): void {
        if (line.length === 0) {
            this.logger.warn('Received empty data.');
            return;
        }

        const [firstChar, value] = this.parseData(line);
        const component = this.ids.get(firstChar);

        if (component instanceof Button) {
            component.setValue(!!Number(value));

            const buttonLabel = component.getLabel();
            const buttonValue = component.getValue();

            if (buttonValue) {
                this.logger.log(buttonLabel + ' button pressed!');

                if (buttonLabel === 'Start') {
                    this.socket?.emit('GameStartReq');
                    this.gameStarted = true;
                } else if (this.gameStarted) {
                    this.socket?.emit('GameAnswer', buttonLabel);
                }
            }
        }
    }

    private handlePortOpen(): void {
        this.logger.log(`Serial port ${this.port.path} is open.`);
      }
    
    handleError(err: Error): void {
        this.logger.error('Error: ' + err.message);
      }
    private parseData(data: string): [string, string] {
        const firstChar = data[0];
        const value = data.slice(1);
        this.logger.log(`Received data: ${firstChar}:${value}`);
        return [firstChar, value];
    }

    // This map contains all the different input ids and their corresponding commands.
    private ids = new Map<string, Button>([
        ['1', new Button(1, 'Blue')],
        ['2', new Button(2, 'Red')],
        ['3', new Button(3, 'Yellow')],
        ['4', new Button(4, 'Green')],
        ['7', new Button(7, 'Start')],
    ]);

    override handleGameState(gameState: string): void {
        super.handleGameState(gameState);
        this.sendToSerial(gameState)
      }
    sendToSerial(s: string) {
        this.port.write(s+'\n')
      }
}

class Button {
    private value: boolean = false;

    constructor(private id: number, private label: string) { }

    getValue(): boolean {
        return this.value;
    }

    getLabel(): string {
        return this.label;
    }

    setValue(newValue: boolean): void {
        this.value = newValue;
    }
}

export default KashootController;
