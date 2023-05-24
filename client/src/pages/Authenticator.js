import getCookie from "../getCookie";
import App from "./App";
import LoggedIn from "./LoggedIn";

export default function Authenticator(){
  if(getCookie("auth0.OCNZ2wePKUZvWYJ6X6F2S8p8AkdAsTD8.is.authenticated")){
    return(<LoggedIn></LoggedIn>);
  }
  else{
    return(<App>
    </App>)
  }

}