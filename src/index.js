import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';

const { io } = require("socket.io-client");
const socket = io();
console.log(io);

//sfdsdsdfsdf

//sfasfdsfsdfsdf
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
