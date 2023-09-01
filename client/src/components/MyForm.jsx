import React, { useState } from "react";
import { socket } from "../socket";

export function MyForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    /*
      MUY IMPORTANTE!!!!!!111eleventyone
    */
    socket.emit("GameStartReq", () => {
    });
    console.log("awaiting question")
    socket.on("GameQuestion", )
  }

  return (
    <form onSubmit={onSubmit}>
      <p>{value}</p>
      <input onChange={(e) => setValue(e.target.value)} />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
