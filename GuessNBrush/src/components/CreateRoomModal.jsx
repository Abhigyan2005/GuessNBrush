import { useState, useEffect } from "react";
import { getSocket } from "../utilities/socket";
function CreateRoomModal({ SetIsOpen, onConfirm }) {
  const [isVisible, setIsVisible] = useState(false);
  const [copy, setCopy] = useState(false);
  const [RoomID, setRoomID] = useState(null);

  const socket = getSocket();
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 0);


    const handleJoinedPrivateRoom = ({ roomID }) => {
    setRoomID(roomID);
  };

  socket.on("joined-private-room", handleJoinedPrivateRoom);
    return () => {
      clearTimeout(timer);
      socket.off("joined-private-room", handleJoinedPrivateRoom);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(RoomID);
    setCopy(true);
    setTimeout(() => setCopy(false), 1500);
  };

  return (
    <div
      onClick={() => SetIsOpen(false)}
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-amber-100 w-[90%] sm:w-[80%] lg:w-[50%] max-h-[90vh] overflow-y-auto
          rounded-2xl shadow-lg p-10 transition-all duration-200
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
          flex flex-col items-center gap-8`}
      >
        <div className="text-center">
          <p className="text-lg text-gray-700">
            Room has been created! Your room code is:
          </p>

          <div className="mt-4 p-6 bg-amber-50 rounded-2xl flex items-center justify-between gap-4">
            <span className="font-mono text-lg">{RoomID}</span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
            >
              {copy ? "✔️ Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
          <button
            onClick={() => {
              onConfirm(RoomID);
            }}
            className="flex-1 bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white cursor-pointer py-3 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            Join
          </button>

          <button
            onClick={() => SetIsOpen(false)}
            className="flex-1 bg-amber-800 cursor-pointer text-white py-3 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomModal;
