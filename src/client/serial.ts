import {SerialPort} from 'serialport';
import {ReadlineParser} from '@serialport/parser-readline';

export function createSerialServer(serialPort: string) {
const port = new SerialPort({ path:serialPort, baudRate: 115200 });

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log(`Serial port ${serialPort} is open.`);
});

parser.on('data', (line: string) => {
  console.log(`Received data: ${line}`);
});

port.on('error', (err: Error) => {
  console.error('Error:', err.message);
});
}