import { useContext } from 'react';
import { socket } from '../socket';
import GameAnswerButton from './GameAnswerButton'; // Assuming the path to your PlayerCard component
import { RoomContext } from './RoomProvider';

interface GameAnswerButtonProps {
  alternatives: string[]
  setAnswered: React.Dispatch<React.SetStateAction<boolean>>
}

const Buttons: React.FC<GameAnswerButtonProps> = ({ alternatives, setAnswered }) => {
  const colorCodes = [
    'green',
    '#ffb300',
    'red',
    'blue'
  ]
  const { roomCode, } = useContext(RoomContext)

  const handleButtonClick = (index: number) => {
    socket.emit('gameAnswer', roomCode, index)
    setAnswered(true)
  }
  return (
    <div id="buttons">
      {alternatives.map((alternative, index) => (
        <GameAnswerButton key={index} answerId={index} text={alternative} colorCode={colorCodes[index]} onClick={() => handleButtonClick(index)} />
      ))}
    </div>
  );
};

export default Buttons;