import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
    if (!socket) {
        socket = io("http://localhost:3000");
        socket.connect();
        socket.on("connect", () => {
            console.log("Socket Connected: ", socket.id);
        })
    }
    return socket;
}