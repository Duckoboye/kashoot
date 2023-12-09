import Header from './components/Header'
import { useEffect, useContext, useState } from 'react'
import { socket } from './socket'
import SocketButton from './components/SocketButton'
import AnswerButtons from './components/AnswerButtons'
import JoinForm from './components/JoinForm'
import ReadySwitch from './components/ReadySwitch'
import { RoomContext } from './components/RoomProvider'
import PlayersList from './components/PlayersList'
import { Player, Question } from './socket'

function App() {
  const { roomCode, } = useContext(RoomContext)
  const [playerList, setPlayerList] = useState<Player[]>();
  // const [gameStarted, setGameStarted] = useState(false)
  const [, setQuizName] = useState('')
  const [, setGameState] = useState('')
  const [question, setQuestion] = useState<Question>();
  const [questionCorrect, setQuestionCorrect] = useState<boolean>()
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    function onQuestion(question: string, alternatives: string[]) {
      setQuestion({ question, alternatives });
    }
    socket.on('playerList', setPlayerList)
    socket.on('gameStart', setQuizName)
    socket.on('gameState', setGameState)
    socket.on('gameQuestion', (receivedQuestion: string, receivedAlternatives: string[]) => {
      onQuestion(receivedQuestion, receivedAlternatives);
      setAnswered(false)
    });
    socket.on('questionCorrect', () => {
      setQuestionCorrect(true)
    })
    socket.on('questionIncorrect', () => {
      setQuestionCorrect(false)
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
        {playerList && <PlayersList players={playerList}></PlayersList>}
        <hr />
        <h4>answer is... {answered?'correct :)':'incorrect :('}</h4>
        {question?.question && <h1>{question.question}</h1>}
        {!answered &&
        <>
        {question?.alternatives && <AnswerButtons alternatives={question.alternatives} setAnswered={setAnswered}></AnswerButtons>}
        </>
        }
        

        <hr />
      </>}

    </>
  )
}

export default App
