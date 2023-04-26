import "../index.css";
import logo from "../pic/logo.svg";

function LoggedIn() {
  return (
    <div className="LoggedIn">
      <header>
        <img className="logo" src={logo} alt="logo" />
      </header>

      <h2 className="join_text"> Join a kashoot</h2>

      <div className="form">
        <form
          id="register-form"
          method="post"
          action="http://192.168.72.45:8080"
        >
          <input type="text" placeholder="name" classname="name"></input>
          <br></br>
          <input
            type="code"
            required
            placeholder="1234"
            classname="code"
          ></input>
          <br></br>
          <input type="submit" value="Join!" classname="submit"></input>
        </form>
      </div>
    </div>
  );
}

export default LoggedIn;
