import { useRef } from "react";
import { useState, useEffect } from "react";
import { generateUsername } from "../utilities/RandomUserNameGenerator";
import { getSocket } from "../utilities/socket";
function PlayModal({
  SetPlayIsOpen,
  JoinRandomRoom,
  usernameRef,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const socket = getSocket();
  const RoomRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    socket.on("joined-public-room", ({ roomID }) => {
      JoinRandomRoom(roomID, "public");
    });

    return () => {
      socket.off("joined-public-room"); 
    };
  }, [socket]);

  return (
    <div
      onClick={() => SetPlayIsOpen(false)}
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-amber-100 w-[90%] sm:w-[80%] lg:w-[50%] max-h-[90vh] overflow-y-auto 
        rounded-2xl shadow-lg p-10 transition-all duration-200
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        flex flex-col items-center gap-8`}
      >
        <button
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl 
          shadow-md transition-transform hover:scale-105 cursor-pointer"
          onClick={() => {
            const username = usernameRef.current.value;
            const finalUsername = username || generateUsername();
            socket.emit("find-public-room", { username: finalUsername });
          }}
        >
          Join Random Room
        </button>

        <div className="w-full flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="w-full flex flex-col gap-4 items-center">
          <p className="text-lg font-medium text-gray-700">Join Private Room</p>

          <input
            ref={RoomRef}
            type="text"
            placeholder="Enter Room Code"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-blue-400 
            focus:border-transparent transition"
          />

          <button
            className="w-full bg-amber-50 hover:bg-amber-600 text-amber-800 py-3 
            hover:text-white cursor-pointer
            rounded-xl shadow-md transition-transform hover:scale-105"
            onClick={() => {
              JoinRandomRoom(RoomRef.current.value, "private");
            }}
          >
            Join
          </button>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => SetPlayIsOpen(false)}
            className="bg-amber-800 text-white px-6 py-2 rounded-xl 
            shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayModal;