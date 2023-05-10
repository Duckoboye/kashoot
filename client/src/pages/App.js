import "../index.css";
import logo from "../pic/logo.svg";
import LoginButton from "../components/LoginButton";
import Login from "./Login";
import { useAuth0 } from "@auth0/auth0-react";
import LoggedIn from "./LoggedIn";


function App() {
  

  const { user, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return(isAuthenticated?<LoggedIn/>:<Login/>)
}

export default App;
