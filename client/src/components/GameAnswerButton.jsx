// GameAnswerButton.js
import React from 'react';
import { socket } from '../socket';

const GameAnswerButton = ({ colorCode, answerId }) => {
  const emitAnswer = () => {
    socket.emit('gameAnswer', answerId); // Always emit 'gameAnswer' event with data
  };

  const buttonStyle = {
    backgroundColor: colorCode || 'blue', // Use the provided color or default to 'blue'
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <button onClick={emitAnswer} style={buttonStyle}>
      Answer
    </button>
  );
};

export default GameAnswerButton;
