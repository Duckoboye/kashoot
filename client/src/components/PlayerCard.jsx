import React from 'react';

const PlayerCard = ({ username, readyState }) => {
  return (
    <div className="player-card">
      <h3>{username}</h3>
      <p>Ready: {readyState ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default PlayerCard;