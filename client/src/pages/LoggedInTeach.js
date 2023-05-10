import "../index.css";
import logo from "../pic/logo.svg";


function LoggedInTeach() {

  return (
    <div className="LoggedIn">
      <header>
        <div className="teachKashoot">
          <button>Create kashoot</button>
          <button>Your Kashoots</button>
        </div>
        <img className="logo" src={logo} alt="logo" />
      </header>
      <h2 className="join_text"> Join a kashoot</h2>
      <div className="form">
        <form>
          <input type="text" placeholder="name" className="name"></input>
          <br></br>
          <input
            type="code"
            required
            placeholder="1234"
            classname="code"
          ></input>
          <br></br>
          <input type="submit" value="Join!" className="submit"></input>
        </form>
      </div>
    </div>
  );
}

export default LoggedInTeach;