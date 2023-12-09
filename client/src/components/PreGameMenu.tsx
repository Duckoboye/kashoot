import React, { useContext } from 'react';
import PlayersList from './PlayersList'; // Assuming the PlayersList component exists
import ReadySwitch from './ReadySwitch'; // Assuming the ReadySwitch component exists
import SocketButton from './SocketButton'; // Assuming the SocketButton component exists
import { Player } from '../socket';
import { RoomContext } from './RoomProvider';

interface PreGameMenuProps {
    playerList: Player[];
  }
  

const PreGameMenu: React.FC<PreGameMenuProps> = ({ playerList }) => {
    const { roomCode, } = useContext(RoomContext)
    
  return (
    <>
      <SocketButton eventName={'gameStartReq'} eventData={roomCode} />
      <ReadySwitch />
      <hr />
      <PlayersList players={playerList} />
    </>
  );
};

export default PreGameMenu;
