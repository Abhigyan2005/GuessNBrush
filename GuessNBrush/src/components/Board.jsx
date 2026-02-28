import { useState } from "react";

function Board({ roomID, type }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-md px-6 py-3 flex items-center justify-between">
      <div>
        <p className="font-semibold">
          Room:
          {type === "private" ? (
            <span
              className={`cursor-pointer transition-transform duration-200 *:cursor-pointer hover:text-green-400 hover:scale-95 ${
                copied ? "text-green-600" : ""
              }`}
              onClick={() => {
                navigator.clipboard.writeText(roomID);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              {roomID}
            </span>
          ) : (
            <span>Public room</span>
          )}
        </p>
        <p className="text-xs text-gray-500">Round 2 / 5</p>
      </div>

      <div className="text-lg font-bold tracking-widest">_ _ _ _ _</div>

      <div className="text-indigo-600 font-bold">45s</div>
    </div>
  );
}

export default Board;
