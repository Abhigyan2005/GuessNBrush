import { useState, useEffect } from "react";

function CreateRoomModal({ SetIsOpen, RoomID }) {
  const [isVisible, setIsVisible] = useState(false);
  const [copy, setCopy] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      // setTimeout is used to avoid instant re-render
      setIsVisible(true); //trigger the animation after mount
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        onClick={() => {
          SetIsOpen(false);
        }}
        className="w-screen flex h-screen left-0 right-0 bg-black/50 fixed top-0 justify-center items-center"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`bg-amber-100 w-[80%] h-[60%] lg:w-[50%] lg:h-[50%] rounded-2xl transition duration-200 shadow-lg p-10
                  ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"} flex flex-col justify-center items-center gap-10`}
        >
          <div>
            room has been created your room code is:
            <div className="p-7 bg-amber-50 rounded-2xl mt-2 flex gap-2 justify-evenly">
              {RoomID}
              {copy ? (
                <span className="text-green-500 animate-bounce">✔️</span>
              ) : (
                <span
                  onClick={() => {
                    setCopy(true);
                    navigator.clipboard.writeText(RoomID);
                    setTimeout(() => setCopy(false), 1500);
                  }}
                  className="text-gray-600 cursor-pointer hover:text-xl transition"
                >
                  📋
                  {copy ? "Copied!" : "Copy"}
                </span>
              )}
            </div>
          </div>
          <button
            className="bg-red-500 shadow-lg text-white pt-2 pb-2 pl-4 pr-4 rounded-xl cursor-pointer hover:scale-120 transition"
            onClick={() => {
              SetIsOpen(false);
            }}
          >
            close
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateRoomModal;
