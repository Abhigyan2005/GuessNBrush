import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://guessnbrush.onrender.com/");
    socket.on("connect", () => {
      console.log("Socket Connected: ", socket.id);
    });
  }
  return socket;
};

