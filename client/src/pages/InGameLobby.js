import "../index.css";
import StartButton from '../components/StartButton'

function InGameLobby() {
 return (
    <div className="InGamelobby">
      <header>
        <h1>Pin:498765</h1>
      </header>
      <div className="info">
      <h2>Players:3</h2>
      <StartButton></StartButton>
      </div>
     <div className="nameBox">
        
     </div>
    </div>
  );
 }

export default InGameLobby;