function PlayerList({
  username,
  players,
  numberOfPlayers,
  isHost,
  canStart,
  type,
  onStart,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3">
        Players - {numberOfPlayers}
      </h2>

      <div className="space-y-2 text-sm overflow-y-auto">
        <div className="bg-gray-100 rounded-lg px-3 py-2">
          {players.map((a) => (
            <div
              key={a.id}
              className={
                username?.trim() === a.username?.trim()
                  ? "text-amber-800 font-semibold"
                  : "text-gray-800"
              }
            >
              {a.username} - <span>{a.score}</span>
            </div>
          ))}
        </div>

        {type === "private" && isHost && canStart && (
          <button
            onClick={onStart}
            className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white 
          py-2 rounded-xl font-medium transition-all overflow hover:bg-green-700"
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}

export default PlayerList;
