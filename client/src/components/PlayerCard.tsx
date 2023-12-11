import React from 'react';
import { Player } from '../socket';

const PlayerCard: React.FC<Player> = ({ username, isReady }) => {
  return (
    <div className="player">
      <div id='username'>{username}</div >
      <div id='subtext'>{isReady ? 'Ready!' : 'Not ready'}</div>
    </div>
  );
};

export default PlayerCard;