import "../index.css";
import logo from "../pic/logo.svg";
import LoginButton from "./LoginButton";

function LogedIn() {
  return (
    <div className="App">
      <header>
        <img className="logo" src={logo} alt="logo" />
      </header>
      <div className="knappar"></div>

      <script src="/socket.io/socket.io.js"></script>
      <script>var socket = io();</script>
    </div>
  );
}

export default LogedIn;
