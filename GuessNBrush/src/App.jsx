// import { useEffect, useState } from "react";
// import { socket } from "./utilities/socket.js";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import "./App.css";
import GameRoom from "./pages/GameRoom.jsx";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/GameRoom" element={<GameRoom />} />
      </Routes>
    </>
  );
}

export default App;
