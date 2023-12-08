import React from 'react';
import PlayerCard from './PlayerCard'; // Assuming the path to your PlayerCard component

const PlayersList = ({ players }) => {
  return (
    <div className="players-list">
      {players.map((player, index) => (
        <PlayerCard key={index} username={player.username} readyState={player.readyState} />
      ))}
    </div>
  );
};

export default PlayersList;