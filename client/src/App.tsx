import { useEffect, useContext, useState } from 'react'
import { Scoreboard, socket } from './socket'
import JoinForm from './components/JoinForm'
import { RoomContext } from './components/RoomProvider'
import { Player, Question } from './socket'
import PreGameMenu from './components/PreGameMenu'
import InGameMenu from './components/InGameMenu'
import Loading from './components/Loading'
import PostGame from './components/PostGame'

function App() {
  const { roomCode, } = useContext(RoomContext)
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [, setQuizName] = useState<string>()
  const [gameState, setGameState] = useState<string>('stopped')
  const [question, setQuestion] = useState<Question>();
  const [questionCorrect, setQuestionCorrect] = useState<boolean | undefined>()
  const [answered, setAnswered] = useState<boolean>(false)
  const [winner, setWinner] = useState<string>()
  const [scoreboard, setScoreboard] = useState<Scoreboard>()

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
      setQuestionCorrect(undefined)
    });
    socket.on('questionCorrect', () => {
      setQuestionCorrect(true)
    })
    socket.on('questionIncorrect', () => {
      setQuestionCorrect(false)
    })
    socket.on('gameWin', setWinner)
    socket.on('scoreboard', (scoreboard) => {
      console.log('epico', scoreboard)
      setScoreboard(scoreboard)
    })

    return () => {
      socket.off('playerList')
      socket.off('gameStart')
      socket.off('gameState')
      socket.off('gameQuestion')
      socket.off('questionCorrect')
      socket.off('questionIncorrect')
      socket.off('gameWin')
      socket.off('gameState')
      socket.off('scoreboard')
    }
  }, [])
  let toRender
  switch (gameState) {
    case 'stopped':
      toRender = <PreGameMenu playerList={playerList}></PreGameMenu>
      break;
    case 'running':
      toRender = question ? <InGameMenu question={question} answered={answered} setAnswered={setAnswered} answeredCorrect={questionCorrect} /> : <Loading />
      break;
    case 'finished':
      toRender = <PostGame scoreboard={scoreboard} winner={winner} />
      break;
    default:
      break;
  }

  return (
    <>
      {!roomCode ? <JoinForm /> : (
        toRender)}
    </>
  )
}

export default App
