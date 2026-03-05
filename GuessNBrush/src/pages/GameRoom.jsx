import Canvas from "../components/Canvas";
import ChatPanel from "../components/ChatPanel";
import PlayerList from "../components/PlayerList";
import Board from "../components/Board.jsx";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { getSocket } from "../utilities/socket.js";

function GameRoom() {
  const location = useLocation();
  const [players, setPlayers] = useState([]);
  const { username, roomID, type } = location.state || {};
  const socket = getSocket();
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.history.replaceState(null, "");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    if (!roomID) return;
    console.log(username, roomID, type);
    socket.on("room-players", (roomPlayers) => {
      setPlayers(roomPlayers);
    });

    socket.emit("join-room", { roomID, type, username });

    return () => {
      socket.emit("leave-room", { roomID });
      socket.off("room-players");
    };
  }, [roomID, type, username]);
  return (
    <div className="min-h-screen bg-[#fdefe2] px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <Board roomID={roomID} type={type} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[75vh]">
          <div className="lg:col-span-3 h-full">
            <PlayerList
              username={username}
              players={players}
              numberOfPlayers={players.length}
            />
          </div>

          <div className="lg:col-span-6 h-full">
            <Canvas roomID={roomID}/>
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