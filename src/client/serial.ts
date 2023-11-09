import {SerialPort} from 'serialport';
import {ReadlineParser} from '@serialport/parser-readline';
import { ioc, serialLogger } from '..';
import { createSocketClient } from './socket-client';
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
ids.set('1', new Button(1,"Blue"))
ids.set('2', new Button(2,"Red"))
ids.set('3', new Button(3,"Yellow"))
ids.set('4', new Button(4,"Green"))
ids.set('7', new Button(7, "Start"))

export function createSerialServer(serialPort: string) {
  const port = new SerialPort({ path:serialPort, baudRate: 115200 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
  let ioc;
  port.on('open', () => {
    serialLogger.log(`Serial port ${serialPort} is open.`);
    ioc = createSocketClient('http://localhost:5000')
  });
  parser.on('data', (line: string) => {
    if (line.length === 0) return serialLogger.warn("Received empty data.");
    const [ firstChar, value ] = parseData(line)

    const component = ids.get(firstChar)
    if (component instanceof Button) {
    component.setValue(value==='1') //Verify whether this works or not
    const buttonLabel = component.getLabel()
    const buttonValue = component.getValue()
    if (buttonLabel == 'Start' && buttonValue == true) {
      serialLogger.log('Start button pressed!')
      }
    }
    
  });
  port.on('error', (err: Error) => {
    serialLogger.error('Error: '+ err.message);
  });
}

function parseData(data: string): [string, string] {
  const firstChar = data[0];
  const value = data.slice(1)
  serialLogger.log(`Received data: ${firstChar}:${value}`)
  return [firstChar, value]
}