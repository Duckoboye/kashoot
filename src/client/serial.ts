import {SerialPort} from 'serialport';
import {ReadlineParser} from '@serialport/parser-readline';

const portName = 'COM7' //Hardcoded for the time being, please refactor to use .env in the future.

const port = new SerialPort({ path:portName, baudRate: 115200 });

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log(`Serial port ${portName} is open.`);
});

parser.on('data', (line: string) => {
  console.log(`Received data: ${line}`);
});

port.on('error', (err: Error) => {
  console.error('Error:', err.message);
});