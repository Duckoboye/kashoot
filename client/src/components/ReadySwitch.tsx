// ToggleSwitch.js
import { useState, useContext, ReactNode } from 'react';
import { socket } from '../socket.js'; // Import the socket object
import { RoomContext } from './RoomProvider.js'

const ToggleSwitch = ({children}: {children: ReactNode}) => {
  const [isReady, setIsReady] = useState(false);
  const { roomCode, } = useContext(RoomContext)
  const handleToggle = () => {
    const newState = !isReady;
    setIsReady(newState);
    socket.emit('readyState', roomCode, newState); // Emit 'readyState' event with the new state
  };

  return (
        <button id='ready' onClick={handleToggle}>
          {children}
        </button>
  );
};

export default ToggleSwitch;
