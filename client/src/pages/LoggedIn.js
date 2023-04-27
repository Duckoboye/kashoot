import "../index.css";
import logo from "../pic/logo.svg";
import React, { useState, useEffect } from "react";
import { socket } from "../socket";
import { ConnectionManager } from "../components/ConnectionManager";
import { MyForm } from "../components/MyForm";

function LoggedIn() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      //socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="LoggedIn">
      <header>
        <img className="logo" src={logo} alt="logo" />
      </header>
      <h2 className="join_text"> Join a kashoot</h2>
      <div className="form">
        <form>
          <input type="text" placeholder="name" className="name"></input>
          <br></br>
          <br></br>
          <input type="submit" value="Join!" className="submit"></input>
        </form>
      </div>
      <p>State: {"" + isConnected}</p>
      <ConnectionManager />
      <MyForm />
    </div>
  );
}

export default LoggedIn;
