import React from 'react';
import { Player } from '../socket';

const PlayerCard: React.FC<Player> = ({ username, isReady }) => {
  return (
    <div className="player-card">
      <h3>{username}</h3>
      <p>Ready: {isReady ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default PlayerCard;