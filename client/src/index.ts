import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to the server');
});

socket.on('error', (error: any) => {
  console.error('Socket.io error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});