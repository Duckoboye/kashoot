import React, { useContext } from 'react';
import PlayersList from './PlayersList'; // Assuming the PlayersList component exists
import ReadySwitch from './ReadySwitch'; // Assuming the ReadySwitch component exists
import SocketButton from './SocketButton'; // Assuming the SocketButton component exists
import { socket, Player } from '../socket';
import { RoomContext } from './RoomProvider';
import './PreGame.css'
interface PreGameMenuProps {
  playerList: Player[];
}

const PreGameMenu: React.FC<PreGameMenuProps> = ({ playerList }) => {
  const mainPlayer = playerList.find((player => player.id == socket.id))
  const otherPlayersList = playerList.filter((player => player.id != socket.id))
  return (
    <>
      <div className="pregame">
        <div id="container">
          <Header></Header>
          {mainPlayer && <MainPlayer player={mainPlayer}></MainPlayer>}
        </div>
        <PlayersList players={otherPlayersList} />
      </div>
    </>
  );
};

export default PreGameMenu;

function Header() {
  const { roomCode, } = useContext(RoomContext)
  return (
    <header>
      <div id='text'>{roomCode}</div>
    </header>
  )
}
function MainPlayerControls() {
  const { roomCode, } = useContext(RoomContext)
  return (<div id="buttons">
    {/* TODO: make us functional! */}
    <ReadySwitch><h3>Ready!</h3></ReadySwitch>
    <SocketButton eventName={'gameStartReq'} eventData={roomCode}><h3>Start!</h3></SocketButton>
  </div>)
}

function MainPlayer({player}: {player: Player}) {
  return (
    <div id="mainplayer">
      <div id="card">
        <h3 id="username">{player.username}</h3>
        <text id="readystate">{player.isReady?'ready':'not ready'}</text>
      </div>
      <MainPlayerControls></MainPlayerControls>
    </div>
  )
}