import React from 'react';
import PlayerCard from './PlayerCard'; // Assuming the path to your PlayerCard component
import { Player } from '../socket';

interface PlayersListProps {
  players: Player[];
}

const PlayersList: React.FC<PlayersListProps> = ({ players }) => {
  return (
    <div className="players-list">
      {
      players.map((player, index) => (
        <PlayerCard key={index} username={player.username} isReady={player.isReady} id={player.id} />
      ))
      }
    </div>
  );
};

export default PlayersList;
