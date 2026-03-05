import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createRoomId } from "./utilities/generateRoomId.js";
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

const publicRooms = [];
const rooms = new Map();
const MAX_PUBLIC_PLAYERS = 4;
io.on("connection", (socket) => {
  socket.on("join-room", ({ roomID, type, username }) => {
    socket.join(roomID);

    if (!rooms.has(roomID)) {
      rooms.set(roomID, {
        type: type,
        players: [],
        gameStarted: false,
        host: socket.id,

        currentDrawerIndex: 0,
        currentWord: null,
        round: 1,
        guessedPlayers: new Set(),
        timer: null,
      });
    }

    const room = rooms.get(roomID);

    const alreadyExists = room.players.some(
      (player) => player.id === socket.id,
    );

    if (!alreadyExists) {
      room.players.push({
        id: socket.id,
        username,
        score: 0,
      });
    }

    io.to(roomID).emit("room-players", room.players);

    if (
      room.type === "public" &&
      room.players.length >= 2 &&
      !room.gameStarted
    ) {
      room.gameStarted = true;
      io.to(roomID).emit("game-started");
    }
  });

  socket.on("find-public-room", ({ username }) => {
    let room;
    let roomID = publicRooms.find((id) => {
      room = rooms.get(id);
      return room && room.players.length < MAX_PUBLIC_PLAYERS;
    });

    if (!roomID) {
      roomID = createRoomId();
      rooms.set(roomID, {
        type: "public",
        players: [],
        gameStarted: false,
        host: socket.id,
      });
      publicRooms.push(roomID);
    }

    room = rooms.get(roomID);

    const alreadyExists = room.players.some(
      (player) => player.id === socket.id,
    );

    if (!alreadyExists) {
      room.players.push({
        id: socket.id,
        username,
        score: 0,
      });
    }
    socket.join(roomID);

    io.to(roomID).emit("room-players", room.players);
    if (
      room.type === "public" &&
      room.players.length >= 2 &&
      !room.gameStarted
    ) {
      room.gameStarted = true;
      io.to(roomID).emit("game-started");
    }
    socket.emit("joined-public-room", { roomID });
  });

  socket.on("leave-room", ({ roomID }) => {
    const room = rooms.get(roomID);
    if (!room) return;

    room.players = room.players.filter((player) => player.id !== socket.id);

    socket.leave(roomID);

    io.to(roomID).emit("room-players", room.players);

    if (room.players.length === 0) {
      rooms.delete(roomID);

      const index = publicRooms.indexOf(roomID);
      if (index !== -1) {
        publicRooms.splice(index, 1);
      }
    }
  });

  socket.on("disconnect", () => {
    for (const [roomID, room] of rooms.entries()) {
      const updatedPlayers = room.players.filter(
        (player) => player.id !== socket.id,
      );

      if (updatedPlayers.length !== room.players.length) {
        room.players = updatedPlayers;

        io.to(roomID).emit("room-players", room.players);
      }

      if (room.players.length === 0) {
        rooms.delete(roomID);

        const index = publicRooms.indexOf(roomID);
        if (index !== -1) {
          publicRooms.splice(index, 1);
        }
      }
    }
  });
});

server.listen(3000, () => {
  console.log("server is running");
});
