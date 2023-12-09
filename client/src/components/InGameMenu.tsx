import React from 'react';
import AnswerButtons from './AnswerButtons'; // Assuming the AnswerButtons component exists
import { Question } from '../socket';

interface InGameMenuProps {
    question: Question
    answered: boolean|undefined
    setAnswered: React.Dispatch<React.SetStateAction<boolean>>
    answeredCorrect: boolean|undefined
}

const InGameMenu: React.FC<InGameMenuProps> = ({ question, answered, setAnswered, answeredCorrect }) => {
  return (
    <>
      {answered ? (
        <>
          {/* Display the result */}
          {answeredCorrect ? <h1>Correct :)</h1> : <h1>Incorrect :(</h1>}
        </>
      ) : (
        <>
          {/* Display the question and answer buttons */}
          <h1>{question.question}</h1>
          <AnswerButtons
            alternatives={question.alternatives}
            setAnswered={setAnswered}
          />
        </>
      )}
    </>
  );
};

export default InGameMenu;
