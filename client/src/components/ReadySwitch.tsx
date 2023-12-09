// ToggleSwitch.js
import { useState, useContext } from 'react';
import { socket } from '../socket.js'; // Import the socket object
import { RoomContext } from './RoomProvider.js'

const ToggleSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { roomCode, } = useContext(RoomContext)
  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    socket.emit('readyState', roomCode, newState); // Emit 'readyState' event with the new state
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
        />
        <span>Ready?</span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
