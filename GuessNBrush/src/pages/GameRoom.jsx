import Canvas from "../components/Canvas";
import ChatPanel from "../components/ChatPanel";
import PlayerList from "../components/PlayerList";
import Board from "../components/Board.jsx";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { getSocket } from "../utilities/socket.js";
import WordSelectionModal from "../components/WordSelectionModal.jsx";

function GameRoom() {
  const location = useLocation();
  const [players, setPlayers] = useState([]);
  const { username, roomID, type } = location.state || {};
  const socket = getSocket();

  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [wordChoices, setWordChoices] = useState([]);
  const [gamePhase, setGamePhase] = useState("waiting");
  const [drawerID, setDrawerID] = useState(null);
  const [drawerName, setDrawerName] = useState("");
  const [hint, setHint] = useState("");
  const [timeLeft, setTimeLeft] = useState(80);

  const isDrawer = drawerID === socket.id;
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

    socket.on("waiting-for-word", ({ drawerName, drawerID }) => {
      setDrawerName(drawerName);
      setDrawerID(drawerID);
      setGamePhase("word-selection");
    });

    socket.on("choose-word", ({ words }) => {
      setWordChoices(words);
      setGamePhase("word-selection");
    });

    socket.on("turn-started", ({ drawerID, hint, round, totalRounds }) => {
      setDrawerID(drawerID);
      setHint(hint);
      setRound(round);
      setTotalRounds(totalRounds);
      setGamePhase("drawing");
    });

    socket.on("timer-tick", ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    });

    socket.on("hint-update", ({ hint }) => {
      setHint(hint);
    });

    socket.on("turn-ended", ({ word }) => {
      setGamePhase("turn-ended");
      setTimeLeft(80);
    });

    socket.emit("join-room", { roomID, type, username });

    return () => {
      socket.emit("leave-room", { roomID });
      socket.off("room-players");
      socket.off("choose-word");
      socket.off("waiting-for-word");
      socket.off("turn-started");
      socket.off("turn-ended");
      socket.off("timer-tick");
      socket.off("hint-update");
    };
  }, [roomID, type, username]);

  return (
    <>
      <div className="min-h-screen bg-[#fdefe2] px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <Board
            roomID={roomID}
            type={type}
            hint={hint}
            timeLeft={timeLeft}
            round={round}
            totalRounds={totalRounds}
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[75vh]">
            <div className="lg:col-span-3 h-full">
              <PlayerList
                username={username}
                players={players}
                numberOfPlayers={players.length}
              />
            </div>

            <div className="lg:col-span-6 h-full">
              <Canvas roomID={roomID} isDrawer={isDrawer}/>
            </div>

            <div className="lg:col-span-3 h-full">
              <ChatPanel
                roomID={roomID}
                username={username}
                isDrawer={isDrawer}
              />
            </div>
          </div>
        </div>
      </div>

      {gamePhase === "word-selection" && (
        <WordSelectionModal
          wordChoices={wordChoices}
          isDrawer={isDrawer}
          drawerName={drawerName}
          onWordSelect={(word) => {
            socket.emit("word-chosen", { roomID, word });
            setGamePhase("drawing");
          }}
        />
      )}
    </>
  );
}

export default GameRoom;
