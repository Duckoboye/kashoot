import { SerialPort, type SerialPortMock } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { createSocketClient } from './socket-client';
import { type Socket } from 'socket.io-client';
import Logger from '../utils/logger';

export const serialLogger = new Logger('serial')
class Button {
  private id: number;
  private label: string;
  private value: boolean;

  constructor(id: number, label: string) {
    this.id = id;
    this.label = label;
    this.value = false; // Initialize the value as false (boolean)
  }

  getValue(): boolean {
    return this.value;
  }
  getLabel(): string {
    return this.label
  }

  setValue(newValue: boolean): void {
    this.value = newValue
  }
}

//This map contains all the different input ids and their corresponding commands.
const ids = new Map()
ids.set('1', new Button(1, "Blue"))
ids.set('2', new Button(2, "Red"))
ids.set('3', new Button(3, "Yellow"))
ids.set('4', new Button(4, "Green"))
ids.set('7', new Button(7, "Start"))

export function createSerialPort(path: string): SerialPort {
  const port = new SerialPort({ path, baudRate: 115200 })
  return port
}

export function createSerialServer(port: SerialPort | SerialPortMock) {
  serialLogger.log('serialport created')
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
  let socket: Socket;
  let gameStarted: boolean;
  function handleDataReceived(line: string) {
    if (line.length === 0) {
      serialLogger.warn("Received empty data.");
      return;
    }
    const [firstChar, value] = parseData(line);
    const state = Number(value);
    const component = ids.get(firstChar);
    if (component instanceof Button) {
      component.setValue(!!state);

      const buttonLabel = component.getLabel();
      const buttonValue = component.getValue();

      if (buttonValue) {
        serialLogger.log(buttonLabel + ' button pressed!');
        if (buttonLabel === 'Start') {
          socket.emit('GameStartReq');
          gameStarted = true;
        }
        else if (gameStarted) socket.emit('GameAnswer', buttonLabel);
      }
    }
  }

  function handlePortOpen() {
    serialLogger.log(`Serial port ${port.path} is open.`);
    socket = createSocketClient('http://localhost:5000', port); //should be configurable or automatically assigned in the future.
  }

  function handleError(err: Error) {
    serialLogger.error('Error: ' + err.message);
  }

  port.on('open', handlePortOpen);

  parser.on('data', handleDataReceived);

  port.on('error', handleError);
}

function parseData(data: string): [string, string] {
  const firstChar = data[0];
  const value = data.slice(1);
  serialLogger.log(`Received data: ${firstChar}:${value}`);
  return [firstChar, value];
}

