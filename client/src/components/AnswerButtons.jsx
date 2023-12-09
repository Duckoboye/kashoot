import React from 'react';
import GameAnswerButton from './GameAnswerButton'; // Assuming the path to your PlayerCard component

const Buttons = ({ alternatives }) => {
  return (
    <div className="answerButtons">
      {alternatives.map((alternative, index) => (
        <GameAnswerButton key={index} answerId={index} text={alternative} />
      ))}
    </div>
  );
};

export default Buttons;