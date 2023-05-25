import "../index.css";
import LoginButton from "../components/LoginButton";
import Login from "./Login";
import { useAuth0 } from "@auth0/auth0-react";
import LoggedIn from "./LoggedIn";
import getCookie from "../getCookie";
import Loading from "../components/Loading"

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  if (isLoading) {
    return <Loading></Loading>;
  }
  return(isAuthenticated?<LoggedIn/>:<Login/>)
}

export default App;
