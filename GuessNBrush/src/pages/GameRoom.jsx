import Canvas from "../components/Canvas";
import ChatPanel from "../components/ChatPanel";
import PlayerList from "../components/PlayerList";
import Board from "../components/Board.jsx";
import { useLocation } from "react-router-dom";
import { getSocket } from "../utilities/socket.js";
import { useEffect } from "react";
function GameRoom() {
  const socket = getSocket();
  const location = useLocation();
  const { username, roomID } = location.state || {};
  useEffect(() => {
    if (!roomID) return;

    socket.on("connect", () => {
      console.log("Gameroom sees id: ", socket.id);

      // 🔥 JOIN THE ROOM HERE
      socket.emit("join-room", roomID);
    });

    return () => {
      socket.off("connect");
    };
  }, [socket, roomID]);
  return (
    <div className="min-h-screen bg-[#fdefe2] px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <Board roomID={roomID} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[75vh]">
          <div className="lg:col-span-3 h-full">
            <PlayerList username={username} />
          </div>

          <div className="lg:col-span-6 h-full">
            <Canvas />
          </div>

          <div className="lg:col-span-3 h-full">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameRoom;
