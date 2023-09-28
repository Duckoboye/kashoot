import { useEffect, useState } from "react";
import "../index.css";
import { socket } from "../socket";
import AnsButton from "../components/AnsButtons";

const defaultQuestion = {
            "question": "", 
            "answers": [
                {"id": 1, "answer": ""}, 
                {"id": 2, "answer": ""}, 
                {"id": 3, "answer": ""}, 
                {"id": 4, "answer": ""}
            ]
        };

function StartGame() {
    
    
    
    const [question, setQuestion] = useState(defaultQuestion);
    const [haveQuestion, setHaveQuestion] = useState(false);

    function sendStartGame() {
        socket.emit("GameStartReq", "test")
        console.log("test")
    }

    useEffect(()=>{
        socket.on('connect', () => {
        console.log("test")
        socket.on('GameQuestion', () => {
            console.log("whet")
        })
        })

        socket.on("GameStarting", (data) => {
            console.log(data)
        })
        socket.on("GameQuestion", (data) => {
            setQuestion(data);
            if(data !== defaultQuestion){ 
                setHaveQuestion(true)
            }
            else{
                setHaveQuestion(false)
            }
        })
    },[]);
    
    
    

    return (
        <div className="startGame">
        <button onClick={sendStartGame}>Click me</button>

        {
            haveQuestion &&
            <>
            
            <p className="rubrik_quest">{question.question}</p>
            <div className="container">

            <AnsButton id={question.answers[0].id} question={question.answers[0].answer}/>
            <AnsButton id={question.answers[1].id} question={question.answers[1].answer}/>
            <AnsButton id={question.answers[2].id} question={question.answers[2].answer}/>
            <AnsButton id={question.answers[3].id} question={question.answers[3].answer}/>
            </div>
            </>
        }
              
      
        </div>

        /* <div className="container">
              <p className="question">{question.question}</p>

         <button classname= "a"><p>{question.answers[0].answer}</p></button>
         <button classname= "b"><p>{question.answers[1].answer}</p></button>
         <button classname= "c"><p>{question.answers[2].answer}</p></button>
         <button classname= "d"><p>{question.answers[3].answer}</p></button>

        </div>*/
    );
}

export default StartGame;