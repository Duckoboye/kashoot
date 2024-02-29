// GameAnswerButton.js
import React, { } from 'react';

interface GameAnswerProps {
  colorCode: string
  answerId: number //Change to 0|1|2|3 later
  text: string
  onClick: () => void
}


const GameAnswerButton: React.FC<GameAnswerProps> = ({ colorCode, text, onClick }) => {

  const buttonStyle = {
    backgroundColor: colorCode || 'blue', // Use the provided color or default to 'blue'
    cursor: 'pointer',
  };

  return (
    <button onClick={() => onClick()} style={buttonStyle}>
      <div className="label">{text}</div>
    </button>
  );
};

export default GameAnswerButton;
