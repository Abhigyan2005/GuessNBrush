function PlayerList({ username, players, numberOfPlayers }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3">
        Players - {numberOfPlayers}
      </h2>

      <div className="space-y-2 text-sm overflow-y-auto">
        <div className="bg-gray-100 rounded-lg px-3 py-2">
          {players.map((a, index) => (
            <div
              key={index}
              className={
                username === a.username
                  ? "text-blue-600 font-semibold"
                  : "text-gray-800"
              }
            >
              {a.username} - <span>{a.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerList;
