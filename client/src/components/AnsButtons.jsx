import React from "react";
import { socket } from "../socket";

const AnsButton = (props) => {
    function sendQuestion(){
            socket.emit("MyAnswer",
                // socket.id? props.id, ngt mer?
            )
    }

  return (
   <button onClick={sendQuestion}>{props.question}</button>
  )
};

export default AnsButton