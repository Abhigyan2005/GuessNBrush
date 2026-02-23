function Board() {
  return (
    <div className="bg-white rounded-xl shadow-md px-6 py-3 flex items-center justify-between">
      <div>
        <p className="font-semibold">Room: AB12C</p>
        <p className="text-xs text-gray-500">Round 2 / 5</p>
      </div>

      <div className="text-lg font-bold tracking-widest">
        _ _ _ _ _
      </div>

      <div className="text-indigo-600 font-bold">
        45s
      </div>
    </div>
  );
}

export default Board;