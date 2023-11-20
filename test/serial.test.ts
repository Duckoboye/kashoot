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
  
      port.on('open', () => {
        setTimeout(done,1000)
      });
    });
  
    it('should receive data',() => {
        port.port?.emitData('1test\n')
    })
    it('should be able to take input from buttons', () => {
        port.port?.emitData('11\n')
        port.port?.emitData('21\n')
        port.port?.emitData('31\n')
        port.port?.emitData('41\n')
        port.port?.emitData('10\n')
        port.port?.emitData('20\n')
        port.port?.emitData('30\n')
        port.port?.emitData('40\n')
    })
    it('should be able to start a game', (done) => {
        port.port?.emitData('71\n')
        setTimeout(done, 1500)
    })
    it('should be able to answer a question', (done) => {
        port.port?.emitData('11\n')
        setTimeout(done, 200)
    })

    after(() => {
      httpServer.close();
      socketServer.close();
      port.close();
    });
  });