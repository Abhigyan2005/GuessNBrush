import Canvas from "../components/Canvas";
import ChatPanel from "../components/ChatPanel";
import PlayerList from "../components/PlayerList";
import Board from "../components/Board.jsx";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { getSocket } from "../utilities/socket.js";
import WordSelectionModal from "../components/WordSelectionModal.jsx";
import Leaderboard from "../components/Leaderboard.jsx";

function GameRoom() {
  const location = useLocation();
  const [players, setPlayers] = useState([]);
  const { username, roomID, type } = location.state || {};
  const socket = getSocket();
  const [turnEndWord, setTurnEndWord] = useState("");
  const [canStart, setCanStart] = useState(false);
  const isHost = players[0]?.id === socket.id;
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [wordChoices, setWordChoices] = useState([]);
  const [gamePhase, setGamePhase] = useState("waiting");
  const [drawerID, setDrawerID] = useState(null);
  const [drawerName, setDrawerName] = useState("");
  const [hint, setHint] = useState("");
  const [timeLeft, setTimeLeft] = useState(80);
  const [currentWord, setCurrentWord] = useState("");
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
    socket.on("room-players", (roomPlayers) => {
      setPlayers(roomPlayers);
    });

    socket.on("waiting-for-word", ({ drawerName, drawerID }) => {
      setGamePhase((prev) => {
        if (prev === "game-over") return prev;
        setDrawerName(drawerName);
        setDrawerID(drawerID);
        return "word-selection";
      });
    });

    socket.on("choose-word", ({ words }) => {
      setWordChoices(words);
      setGamePhase((prev) => (prev === "game-over" ? prev : "word-selection"));
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
      setTurnEndWord(word);
      setTimeLeft(80);
    });

    socket.on("game-over", ({ players }) => {
      setPlayers(players);
      setGamePhase("game-over");
    });

    socket.on("can-start", () => setCanStart(true));

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
      socket.off("game-over");
      socket.off("can-start");
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
            username={username}
            isDrawer={isDrawer}
            currentWord={currentWord}
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[75vh] overflow-hidden">
            <div className="lg:col-span-3 h-full min-h-0">
              <PlayerList
                username={username}
                players={players}
                numberOfPlayers={players.length}
                isHost={isHost}
                canStart={canStart}
                type={type}
                onStart={() => {
                  socket.emit("start-game", { roomID });
                  setCanStart(false);
                }}
              />
            </div>

            <div className="lg:col-span-6 h-full min-h-0">
              <Canvas roomID={roomID} isDrawer={isDrawer} />
            </div>

            <div className="lg:col-span-3 h-full min-h-0">
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
            setCurrentWord(word);
            socket.emit("word-chosen", { roomID, word });
            setGamePhase("drawing");
          }}
        />
      )}

      {gamePhase === "game-over" && (
        <Leaderboard username={username} players={players} />
      )}

      {gamePhase === "turn-ended" && !isDrawer && (
        <div
          className="overflow-none fixed top-0 left-0 w-screen h-screen bg-black/50 
    flex justify-center items-center z-50"
        >
          <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-4">
            <p className="text-gray-500 text-lg">The word was</p>
            <h2 className="text-4xl font-bold text-amber-600">{turnEndWord}</h2>
            <p className="text-gray-400 text-sm">Next round starting soon...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default GameRoom;
