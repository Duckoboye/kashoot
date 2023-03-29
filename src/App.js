import "./index.css";
import logo from "./pic/logo.svg";

function App() {
  return (
    <div className="App">
      <header>
        <img className="logo" src={logo} alt="logo" />
      </header>
      <div className="knappar">
        <button type="button" className="knapp">
          Log in
        </button>
        <button type="button" className="knapp">
          sign up
        </button>
      </div>

      <script src="/socket.io/socket.io.js"></script>
      <script>var socket = io();</script>
    </div>
  );
}

export default App;
