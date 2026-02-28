import { useState, useEffect } from "react";

function CreateRoomModal({ SetIsOpen, RoomID, onConfirm }) {
  const [isVisible, setIsVisible] = useState(false);
  const [copy, setCopy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(timer);
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
          <p className="text-lg text-gray-700">Room has been created! Your room code is:</p>

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
            onClick={onConfirm}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            Join
          </button>

          <button
            onClick={() => SetIsOpen(false)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomModal;