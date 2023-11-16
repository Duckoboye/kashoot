import { expect } from 'chai' 
import { SerialPortMock } from 'serialport'
import { createSerialServer } from '../src/client/serial'
import { createExpressServer } from '../src/server/server'
import { createSocketServer } from '../src/server/socket';
import { type Server } from 'socket.io';
import { type Server as httpServer } from 'http'

describe('Serial Logic Tests', () => {
    let httpServer: httpServer; 
    let socketServer: Server; 
    let port: SerialPortMock;
  
    before((done) => {
      httpServer = createExpressServer(5000);
      socketServer = createSocketServer(httpServer);
  
      const path = 'TEST';
      SerialPortMock.binding.createPort(path);
      port = new SerialPortMock({ path, baudRate: 115200 });
  
      createSerialServer(port);
  
      port.on('open', done);
    });
  
    after(() => {
      httpServer.close();
      socketServer.close();
      port.close();
    });
  });