import "../index.css";
import { io } from "socket.io-client";

function startGame() {
function hilfe() {
            socket.emit("GameStartReq", "test")
            console.log("test")
        }

        const socket = io("http://localhost:3000");
        socket.on('connect', () => {
            console.log("test")
            socket.on('GameQuestion', () => {
                console.log("whet")
            })
        })

        socket.on("GameStarting", (data) => {
            console.log(data)
        })
        socket.on("GameQuestion", (data) => {
            document.getElementById("question").innerHTML = data.question;
            for (let i = 0; i < data.answers.length; i++) {
                document.getElementById("ans" + (i + 1)).innerHTML = data.answers[i].answer;
            }
        })
  return (
    <div className="startGame">
      <button onclick="hilfe()">Click me</button>
    <p id="question"></p>
    <p id="ans1"></p>
    <p id="ans2"></p>
    <p id="ans3"></p>
    <p id="ans4"></p>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    </div>
  );
}

export default startGame;