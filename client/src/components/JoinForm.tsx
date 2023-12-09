// JoinForm.js
import { useState, useContext } from 'react';
import { socket } from '../socket'; // Import the socket object
import { RoomContext } from './RoomProvider.js'

const JoinForm = () => {
  const { setRoomCode } = useContext(RoomContext)
  const [keyInput, setKeyInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');

  const handleJoin = () => {
    // Check if both fields are filled before emitting the event
    if (keyInput && usernameInput) {
      socket.emit('joinGame', usernameInput, keyInput ); // Emit 'joinEvent' with key and username
      
      //update roomcode
      setRoomCode(keyInput)

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
