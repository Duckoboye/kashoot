import Header from './components/Header'
import { useEffect, useContext, useState } from 'react'
import { socket, Events } from './socket'
import React from 'react'
import SocketButton from './components/SocketButton'
import GameAnswerButton from './components/GameAnswerButton'
import JoinForm from './components/JoinForm'
import ReadySwitch from './components/ReadySwitch'
import { RoomContext } from './components/RoomProvider'
import PlayersList from './components/PlayersList'

function App() {
const { roomCode, setRoomCode } = useContext(RoomContext)
const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    socket.on('playerList', (players) => {
      setPlayerList(players)
    })
    return () => {
      socket.off('playerList')
    }
  }, [])

  return (
    <>
    <Header></Header>
    <JoinForm></JoinForm>
    <SocketButton eventName={Events.reqGameStart} eventData={roomCode}></SocketButton>
    <ReadySwitch></ReadySwitch>
    <GameAnswerButton answerId={0} colorCode={'green'}></GameAnswerButton>
    <GameAnswerButton answerId={1} colorCode={'yellow'}></GameAnswerButton>
    <GameAnswerButton answerId={2} colorCode={'red'}></GameAnswerButton>
    <GameAnswerButton answerId={3} colorCode={'blue'}></GameAnswerButton>
    <hr />
    <PlayersList players={playerList}></PlayersList>

    </>
  )
}

export default App
