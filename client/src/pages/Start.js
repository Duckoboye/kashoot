import "../index.css";
import logo from "../pic/logo.svg";
import LoginButton from "../components/LoginButton";


function Start() {
  
return(<div className="App">
      <header>
        <img className="start_logo" src={logo} alt="logo" />
      </header>
      <div className="knappar">
        <LoginButton></LoginButton>
      </div>
      <a href="LoggedIn">eheh </a>
       <a href="LoggedInTeach">Teach </a>
        <a href="InGamelobby">joined </a>
    </div>)
}

export default Start;