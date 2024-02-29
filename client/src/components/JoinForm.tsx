import { useState, useContext } from 'react';
import { socket } from '../socket'; // Import the socket object
import { RoomContext } from './RoomProvider';
import './JoinForm.css'; // Import the CSS file for styling
import Header from './Header';

const JoinForm = () => {
  const { setRoomCode } = useContext(RoomContext);
  const [keyInput, setKeyInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');

  const handleJoin = () => {
    if (keyInput && usernameInput) {
      socket.emit('joinGame', usernameInput, keyInput);
      setRoomCode(keyInput);
      setKeyInput('');
      setUsernameInput('');
    } else {
      alert('Please fill in both fields');
    }
  };

  return (<div className="alignment-wrapper">
    
      <div className="join-form-container">
        <Header/>
        <input
          type="text"
          placeholder="Enter Room"
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
  </div>
  );
};

export default JoinForm;
