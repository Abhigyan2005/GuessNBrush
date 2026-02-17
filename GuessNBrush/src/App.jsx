import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import GameRoom from "./pages/GameRoom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/play" element={<GameRoom />} />
      </Routes>
    </>
  );
}

export default App;
