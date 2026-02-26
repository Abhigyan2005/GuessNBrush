import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("API running");
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (roomID) => {
    socket.join(roomID);
    io.to(roomID).emit(
      "message",
      `A new user has joined the room: ${roomID}`,
    );
  });
});

server.listen(3000, () => {
  console.log("Server running on 3000");
});
