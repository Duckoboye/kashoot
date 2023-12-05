import React, { useEffect } from 'react';
import io from 'socket.io-client';

const SocketIOClient: React.FC = () => {
  useEffect(() => {
    // Establish socket connection
    const socket = io('http://localhost:5000'); // Replace with your server URL

    // Listen for events or perform actions on the socket
    socket.on('connect', () => {
      console.log('Connected to the server!');
    });

    // Example: Sending data to the server
    socket.emit('chat message', 'Hello from client!');

    // Example: Receiving data from the server
    socket.on('chat message', (msg: string) => {
      console.log('Message from server:', msg);
    });

    // Clean up socket on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};

export default SocketIOClient;
