import Header from './components/Header'
import { useEffect, useContext, useState } from 'react'
import { socket, Events } from './socket'
import React from 'react'
import SocketButton from './components/SocketButton'
import AnswerButtons from './components/AnswerButtons'
import JoinForm from './components/JoinForm'
import ReadySwitch from './components/ReadySwitch'
import { RoomContext } from './components/RoomProvider'
import PlayersList from './components/PlayersList'

function App() {
  const { roomCode, setRoomCode } = useContext(RoomContext)
  const [playerList, setPlayerList] = useState([]);
  const [gameStarted, setGameStarted] = useState(false)
  const [quizName, setQuizName] = useState('')
  const [gameState, setGameState] = useState('')
  const [question, setQuestion] = useState({});
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    socket.on('playerList', setPlayerList)
    socket.on('gameStart', setQuizName)
    socket.on('gameState', setGameState)
    socket.on('gameQuestion', (question, alternatives) => {
      setQuestion({
        question: question,
        alternatives: alternatives
      })
    })

    return () => {
      socket.off('playerList')
      socket.off('gameStart')
      socket.off('gameState')
      socket.off('gameQuestion')
    }
  }, [])

  return (
    <>
      <Header></Header>
      <JoinForm></JoinForm>

      {roomCode && <>
        <SocketButton eventName={'gameStartReq'} eventData={roomCode}></SocketButton>
        <ReadySwitch></ReadySwitch>
        <PlayersList players={playerList}></PlayersList>
        {gameState == 'running' && <>
          <hr />
          {question.question && <h1>{question.question}</h1>}
          {question.alternatives && <AnswerButtons alternatives={question.alternatives}></AnswerButtons>}
        </>}
        <hr />
      </>}

    </>
  )
}

export default App
