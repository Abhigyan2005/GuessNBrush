// import { useState } from "react";

function ChatPanel() {
  // const [messages, setMessages] = useState([]);
  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Chat</h2>

      <div className="flex-1 overflow-y-auto text-sm space-y-1 text-gray-600"></div>

      <input
        type="text"
        placeholder="Type guess..."
        className="mt-2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      />
    </div>
  );
}

export default ChatPanel;