// ToggleSwitch.js
import React, { useState } from 'react';
import { socket, Events } from '../socket'; // Import the socket object

const ToggleSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    socket.emit(Events.readyState, newState); // Emit 'readyState' event with the new state
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
