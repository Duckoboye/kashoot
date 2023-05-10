import React from "react";
import App from "./pages/App";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import LoggedIn from "./pages/LoggedIn";
import LoggedInTeach from "./pages/LoggedInTeach";
import InGameLobby from "./pages/InGameLobby";
import Start from "./pages/Start";
import Layout from "./Layout";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="loggedIn" element={<LoggedIn />} />
        <Route path="loggedInTeach" element={<LoggedInTeach />} />
        <Route path="inGameLobby" element={<InGameLobby />} />
         <Route path="Start" element={<Start />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-pyzrhlrc.us.auth0.com"
    clientId="OCNZ2wePKUZvWYJ6X6F2S8p8AkdAsTD8"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <React.StrictMode>
      <MainRoutes />
    </React.StrictMode>
  </Auth0Provider>
);
