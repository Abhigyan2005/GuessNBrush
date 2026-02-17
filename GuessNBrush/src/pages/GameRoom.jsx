import Canvas from "../components/Canvas";
import ChatPanel from "../components/ChatPanel";
import PlayerList from "../components/PlayerList";
import Board from "../components/Board.jsx"
function GameRoom() {
  return (
    <>
      <Board/>
      <div className="flex">
        <PlayerList />
        <Canvas />
        <ChatPanel />
      </div>
    </>
  );
}

export default GameRoom;
