import { useState, useEffect, useRef } from "react";
import { getSocket } from "../utilities/socket.js";

function ChatPanel({ roomID, username, isDrawer }) {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    const handleMessage = ({ username, message }) => {
      setMessages((prev) => [...prev, { type: "chat", username, message }]);
    };

    const handlePlayerGuessed = ({ username }) => {
      setMessages((prev) => [...prev, { type: "guessed", username }]);
    };

    const handleCorrectGuess = () => {
      setMessages((prev) => [...prev, { type: "correct" }]);
    };

    socket.on("chat-message", handleMessage);
    socket.on("player-guessed", handlePlayerGuessed);
    socket.on("correct-guess", handleCorrectGuess);
    socket.on("clear-chat", () => {
      setMessages([]);
    });

    return () => {
      socket.off("chat-message", handleMessage);
      socket.off("player-guessed", handlePlayerGuessed);
      socket.off("correct-guess", handleCorrectGuess);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const msg = inputRef.current.value.trim();
    if (!msg) return;
    socket.emit("chat-message", { roomID, message: msg, username });
    inputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Chat</h2>

      <div className="flex-1 min-h-0 overflow-y-scroll text-sm space-y-1 text-gray-600">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.type === "chat" && (
              <span>
                <span className="font-semibold">{msg.username}:</span>{" "}
                {msg.message}
              </span>
            )}
            {msg.type === "guessed" && (
              <span className="text-green-600 font-semibold">
                ✅ {msg.username} guessed it!
              </span>
            )}
            {msg.type === "correct" && (
              <span className="text-green-600 font-semibold">
                ✅ You guessed it!
              </span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-2 flex gap-2">
        <input
          ref={inputRef}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isDrawer}
          type="text"
          placeholder={isDrawer ? "You are drawing..." : "Type guess..."}
          className="flex-1 border rounded-lg px-3 py-2 text-sm 
          focus:outline-none focus:ring-1 focus:ring-indigo-400
          disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={sendMessage}
          disabled={isDrawer}
          className="px-3 py-2 bg-amber-800 text-white rounded-lg text-sm
        disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
