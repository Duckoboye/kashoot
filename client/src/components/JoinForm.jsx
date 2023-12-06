// JoinForm.js
import React, { useState } from 'react';
import { socket, Events } from '../socket'; // Import the socket object

const JoinForm = () => {
  const [keyInput, setKeyInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');

  const handleJoin = () => {
    // Check if both fields are filled before emitting the event
    if (keyInput && usernameInput) {
      const eventData = {
        key: keyInput,
        username: usernameInput,
      };
      socket.emit(Events.joinGame, eventData); // Emit 'joinEvent' with key and username
      // Reset the input fields after emitting the event
      setKeyInput('');
      setUsernameInput('');
    } else {
      // Handle case where fields are not filled
      alert('Please fill in both fields');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter 6-character key"
        value={keyInput}
        onChange={(e) => setKeyInput(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default JoinForm;
