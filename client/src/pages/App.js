import "../index.css";
import Start from "./Start";
import logo from "../pic/logo.svg";
import LoginButton from "../components/LoginButton";
import Login from "./Login";
import { useAuth0 } from "@auth0/auth0-react";
import LoggedIn from "./LoggedIn";
import getCookie from "../getCookie";

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return(isAuthenticated?<LoggedIn/>:<Login/>)
}

export default App;
