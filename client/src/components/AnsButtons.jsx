import React from "react";
import { socket } from "../socket";

const AnsButton = (props) => {
    function sendQuestion(){
            socket.emit("GameAnswer", props.id)
    }

  return (
   <button onClick={sendQuestion}>{props.question}</button>
  )
};

export default AnsButton