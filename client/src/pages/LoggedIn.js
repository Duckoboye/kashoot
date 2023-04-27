import "../index.css";
import logo from "../pic/logo.svg";
import React, { useState, useEffect } from "react";
import { socket } from "../socket";
import { ConnectionState } from "../components/ConnectionState";
import { ConnectionManager } from "../components/ConnectionManager";
import { MyForm } from "../components/MyForm";

function LoggedIn() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
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
