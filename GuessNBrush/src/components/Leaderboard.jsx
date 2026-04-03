function Leaderboard({ players, username }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 
      flex justify-center items-center z-50">
      
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 min-w-[400px]">
        <h2 className="text-3xl font-bold"> Game Over</h2>
        <p className="text-amber-600 font-semibold text-lg">
          Winner: {winner?.username}
        </p>

        <div className="w-full flex flex-col gap-2">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex justify-between items-center px-4 py-3 rounded-xl
                ${username === player.username ? "bg-indigo-100 text-amber-700 font-semibold" : "bg-gray-100 text-gray-800"}`}
            >
              <span>#{index + 1} {player.username}</span>
              <span className="font-bold">{player.score} pts</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 px-8 py-3 bg-black text-white rounded-xl 
          hover:bg-gray-800 transition-all hover:scale-105"
        >
          Back to Home
        </button>
      </div>

    </div>
  );
}

export default Leaderboard;