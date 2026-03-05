import {
  rooms,
  publicRooms,
  MAX_PUBLIC_PLAYERS,
  addPlayerToRoom,
  removePlayer,
  CreatePublicRoom,
  FindAvailablePublicRoom,
} from "./roomManager.js";

export function setupSockets(io) {
  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomID, type, username }) => {
      socket.join(roomID);

      if (!rooms.has(roomID)) {
        rooms.set(roomID, {
          type,
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

      const room = addPlayerToRoom(roomID, {
        id: socket.id,
        username,
        score: 0,
      });

      io.to(roomID).emit("room-players", room.players);

      if (room.type === "public" && room.players.length > 2) {
        room.gameStarted = true;
        io.to(roomID).emit("game-started");
      }
    });

    socket.on("find-public-room", ({ username }) => {
      let roomID = FindAvailablePublicRoom();
      if (!roomID) {
        roomID = CreatePublicRoom(socket.id);
      }
      const room = addPlayerToRoom(roomID, {
        id: socket.id,
        username,
        score: 0,
      });

      socket.emit("joined-public-room", { roomID });

      if (room.type === "public" && room.players.length > 2) {
        room.gameStarted = true;
        io.to(room).emit("game-started");
      }
    });

    socket.on("leave-room", ({ roomID }) => {
      const room = removePlayer(roomID, socket.id);
      if (room) io.to(roomID).emit("room-players", room.players);
      socket.leave(roomID);
    });

    //socket-drawawaw

    socket.on("disconnect", () => {
      for (const roomID of rooms.keys()) {
        const room = removePlayer(roomID, socket.id);
        if (room) io.to(roomID).emit("room-players", room.players);
      }
    });
  });
}
