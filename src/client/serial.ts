import {SerialPort} from 'serialport';
import {ReadlineParser} from '@serialport/parser-readline';
import { serialLogger } from '..';
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

  setValue(newValue: number): void {
    this.value = (newValue === 1?true:false)
  }
}

const ids = new Map()
ids.set('1', new Button(1,"Blue"))
ids.set('2', new Button(2,"Red"))
ids.set('3', new Button(3,"Yellow"))
ids.set('4', new Button(4,"Green"))

export function createSerialServer(serialPort: string) {
  const port = new SerialPort({ path:serialPort, baudRate: 115200 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  port.on('open', () => {
    serialLogger.log(`Serial port ${serialPort} is open.`);
  });
  parser.on('data', (line: string) => {
    parseData(line)
  });
  port.on('error', (err: Error) => {
    serialLogger.error('Error: '+ err.message);
  });
}

function parseData(data: string) {
  if (data.length === 0) return serialLogger.warn("Received empty data.");
  const firstChar = data.charAt(0);
  const value = Number(data.slice(1))
  const button = ids.get(firstChar)
  button.setValue(value)
  serialLogger.log(`${button.getLabel()} | ${button.getValue()}`)
}