import Header from './components/Header'
import { useEffect } from 'react'
import { socket, Events } from './socket'
import React from 'react'
import SocketButton from './components/SocketButton'
import GameAnswerButton from './components/GameAnswerButton'
import JoinForm from './components/JoinForm'
import ReadySwitch from './components/ReadySwitch'
function App() {

  useEffect(() => {
    return () => {
      socket.off('question')
    }
  }, [])

  return (
    <>
    <Header></Header>
    <JoinForm></JoinForm>
    <SocketButton eventName={Events.reqGameStart} eventData={'abc123'}></SocketButton>
    <ReadySwitch></ReadySwitch>
    <GameAnswerButton answerId={0} colorCode={'green'}></GameAnswerButton>
    <GameAnswerButton answerId={1} colorCode={'yellow'}></GameAnswerButton>
    <GameAnswerButton answerId={2} colorCode={'red'}></GameAnswerButton>
    <GameAnswerButton answerId={3} colorCode={'blue'}></GameAnswerButton>
    </>
  )
}

export default App
