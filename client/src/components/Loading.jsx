import React from "react";
import "../index.css"; 
import Loadingpic from "../pic/loadingpic.webp"

const Loading = () => {
  return (
    <div className="Loadingscreen">
     <img className="Loadingpic" src={Loadingpic} alt="Loading..." />
     </div>
  );
};

export default Loading;