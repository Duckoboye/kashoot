import "../index.css";
import logo from "../pic/logo.svg";
import LoginButton from "../components/LoginButton";
import Loading from "../components/Loading"

function Login() {
  return (
    <div className="App">
      <header>
        <img className="start_logo" src={logo} alt="logo" />
      </header>
      <div className="knappar">
        <LoginButton></LoginButton>
      </div>
      <a href="LoggedIn">eheh </a>
    </div>
  );
}

export default Login;
