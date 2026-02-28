// import { useEffect, useState } from "react";
// import { socket } from "./utilities/socket.js";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import "./App.css";
import GameRoom from "./pages/GameRoom.jsx";
import ProtectedGameRoom from "./components/ProtectedGameRoom.jsx";
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/GameRoom" element={<ProtectedGameRoom />} />
      </Routes>
    </>
  );
}

export default App;
