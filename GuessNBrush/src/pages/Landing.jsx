import Paint from "../components/Paint.jsx";
import { Sparkles } from "lucide-react";
import wave from "../assets/svgs/wave.svg";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../components/CreateRoomModal.jsx";
import { useState } from "react";
import { generateUsername } from "../utilities/RandomUserNameGenerator.js";
import { useRef } from "react";
import PlayModal from "../components/PlayModal.jsx";
import { getSocket } from "../utilities/socket.js";

function Landing() {
  const [IsOpen, SetIsOpen] = useState(false);
  const [IsPlayOpen, SetPlayIsOpen] = useState(false);
  const socket = getSocket();

  const navigate = useNavigate();
  const usernameRef = useRef(null);

  const JoinRandomRoom = (roomID, roomType) => {
    const inputName = usernameRef.current.value;
    const finalUsername = inputName || generateUsername();

    navigate("/GameRoom", {
      state: {
        username: finalUsername,
        roomID: roomID,
        type: roomType,
      },
    });
  };
  return (
    <>
      <div className="min-h-[60vh] flex flex-col justify-center items-center px-6">
        <div className="max-w-6xl w-full text-center mb-12 mt-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">
            <span>Guess</span>
            <span className="text-indigo-700 text-6xl">N</span>
            <span>Brush</span>
          </h1>
        </div>

        <div className="max-w-6xl w-[60%] text-center flex flex-col-reverse lg:flex-row">
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-lg md:text-xl text-gray-600">
              Draw. Guess. Play.
              <Sparkles />
              <span className="text-xs text-green-800 bg-green-100/50 px-2 py-1 rounded-full animate-pulse">
                12 Online
              </span>
            </p>

            <div>
              <span>Username: </span>
              <input
                ref={usernameRef}
                className="bg-white border border-black p-3 rounded-lg"
                type="text"
                placeholder="username"
              />
            </div>

            <div className="mt-6 flex gap-4 justify-center md:justify-start">
              <button
                onClick={() => {
                  SetPlayIsOpen(true);
                }}
                className="
        px-8 py-3
        bg-black text-white
        rounded-xl
        font-medium
        shadow-md
        transition-all duration-200 ease-out
        hover:bg-gray-800
        hover:scale-105
        hover:shadow-xl
        active:scale-95
        active:shadow-md
        cursor-pointer
      "
              >
                Play
              </button>
              {IsPlayOpen && (
                <PlayModal
                  SetPlayIsOpen={SetPlayIsOpen}
                  JoinRandomRoom={JoinRandomRoom}
                  usernameRef={usernameRef}
                />
              )}
              <button
                className="
        cursor-pointer
        px-8 py-3
        border border-black
        rounded-xl
        font-medium
        bg-white
        shadow-sm
        transition-all duration-200 ease-out
        hover:bg-gray-100
        hover:scale-105
        hover:shadow-lg
        active:scale-95
      "
                onClick={() => {
                  const username =
                    usernameRef.current.value || generateUsername();
                  socket.emit("create-private-room", { username });
                  SetIsOpen(true)
                }}
              >
                Create a Room
              </button>
            </div>
          </div>
          {IsOpen && (
            <CreateRoomModal
              SetIsOpen={SetIsOpen}
              onConfirm={(RoomID) => {
                JoinRandomRoom(RoomID, "private");
              }}
            />
          )}
          <div className="md:w-1/2 flex justify-center">
            <Paint />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <img src={wave} alt="wave graphic" className="w-full h-auto block" />

        <div className="bg-pale min-h-screen w-full flex items-center">
          <div className="max-w-6xl mx-auto w-full px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl shadow-lg p-10">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">About</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  GuessNBrush is a free online multiplayer drawing and guessing
                  game where creativity meets quick thinking. Each match is
                  played over multiple rounds. In every round, one player draws
                  a word while the others race to guess it and earn points. The
                  player with the highest score at the end of the game takes the
                  win.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-10">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  How To Play
                </h2>
                <ul className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  <li>
                    <span className="font-semibold text-gray-800">
                      Join a Game:
                    </span>
                    Start a new room or join an existing one.
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">
                      Take Turns Drawing:
                    </span>
                    One player draws a random word each round.
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">
                      Guess Quickly:
                    </span>{" "}
                    Other players type their guesses in chat.
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">
                      Earn Points:
                    </span>{" "}
                    Faster guesses earn more points.
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">Win:</span>{" "}
                    Highest total score after all rounds wins.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
