import React from 'react';
import AnswerButtons from './AnswerButtons'; // Assuming the AnswerButtons component exists
import { Question } from '../socket';
import './InGame.css'

interface InGameMenuProps {
  question: Question
  answered: boolean | undefined
  setAnswered: React.Dispatch<React.SetStateAction<boolean>>
  answeredCorrect: boolean | undefined
}

const InGameMenu: React.FC<InGameMenuProps> = ({ question, answered, setAnswered, answeredCorrect }) => {
  return (
    <div className='alignment-wrapper'>
      <div className="ingame">
        {answered ? (
          <>
            {/* Display the result */}
            {answeredCorrect !== undefined ? <>{answeredCorrect ? <h1>Correct :)</h1> : <h1>Incorrect :(</h1>}</> : <h1>Waiting for other player(s)...</h1>}
          </>
        ) : (
          <>
            {/* Display the question and answer buttons */}
            <QuestionBox text={question}></QuestionBox>
            <AnswerButtons
              alternatives={question.alternatives}
              setAnswered={setAnswered}
            />
          </>
        )}
      </div>
    </div>
  );
};

function QuestionBox({ text }: { text: Question }) {
  return (
    <div id='questionbox'><div id="question">{text.question}</div></div>
  )
}

export default InGameMenu;
