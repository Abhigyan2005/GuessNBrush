import {
  rooms,
  publicRooms,
  MAX_PUBLIC_PLAYERS,
  PrivateRooms,
  addPlayerToRoom,
  removePlayer,
  CreatePublicRoom,
  CreatePrivateRoom,
  FindAvailablePublicRoom,
} from "./roomManager.js";

import {
  StartTurn,
  chooseWord,
  checkGuess,
  endTurn,
  startTimer,
  stopTimer,
} from "./gameManager.js";

export function setupSockets(io) {
  function reassignHost(roomID) {
    const room = rooms.get(roomID);
    if (!room || room.players.length === 0) return;

    room.host = room.players[0].id;

    io.to(roomID).emit("host-changed", { newHostID: room.host });
  }

  function handleStartTurn(roomID) {
    const result = StartTurn(roomID);
    if (!result) return;

    const { drawer, wordChoices } = result;

    io.to(drawer.id).emit("choose-word", { words: wordChoices }); //only to drawer

    io.to(roomID).emit("waiting-for-word", {
      drawerName: drawer.username,
      drawerID: drawer.id,
    });
  }

  function handleTurnEnd(roomID) {
    stopTimer(roomID);
    const room = rooms.get(roomID);
    if (!room) return;
    const turnResult = endTurn(roomID);
    if (!turnResult) return;

    io.to(roomID).emit("turn-ended", { word: turnResult.word });

    setTimeout(() => {
      io.to(roomID).emit("draw-clear");
      io.to(roomID).emit("clear-chat");
      if (turnResult.status === "game-over") {
        io.to(roomID).emit("game-over", {
          players: room.players,
        });
      } else {
        handleStartTurn(roomID);
      }
    }, 3000);
  }

  io.on("connection", (socket) => {
    io.emit("online-count", { count: io.engine.clientsCount });
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
          totalRounds: 3,
          guessedPlayers: new Set(),
          timer: null,
          usedWords: new Set(),
        });
      }

      const room = addPlayerToRoom(roomID, {
        id: socket.id,
        username,
        score: 0,
      });
      io.to(roomID).emit("room-players", room.players);
      socket.emit("host-changed", { newHostID: room.host });
      if (room.type === "public" && room.players.length >= 2) {
        room.gameStarted = true;
        io.to(roomID).emit("game-started");
        handleStartTurn(roomID);
      }

      if (room.type === "private" && room.players.length >= 2) {
        room.gameStarted = true;
        io.to(room.host).emit("can-start");
      }
    });

    socket.on("start-game", ({ roomID }) => {
      const room = rooms.get(roomID);
      if (!room) return;
      room.gameStarted = true;
      io.to(roomID).emit("game-started");
      handleStartTurn(roomID);
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

      if (room.type === "public" && room.players.length >= 2) {
        room.gameStarted = true;
        io.to(roomID).emit("game-started");
        handleStartTurn(roomID);
      }
      if (room.type === "private" && room.players.length >= 2) {
        room.gameStarted = true;
        io.to(room.host).emit("can-start");
      }
    });

    //private rooom
    socket.on("create-private-room", ({ username }) => {
      const roomID = CreatePrivateRoom(socket.id);

      if (!roomID) {
        return null;
      }

      const room = addPlayerToRoom(roomID, {
        id: socket.id,
        username,
        score: 0,
      });

      socket.emit("joined-private-room", { roomID });
    });

    socket.on("leave-room", ({ roomID }) => {
      const wasHost = rooms.get(roomID)?.host === socket.id;
      const room = removePlayer(roomID, socket.id);
      if (room) {
        io.to(roomID).emit("room-players", room.players);
        if (wasHost && room.players.length > 0) reassignHost(roomID);
      }
      socket.leave(roomID);
    });

    //GAME-LOGIC
    socket.on("word-chosen", ({ roomID, word }) => {
      const result = chooseWord(roomID, word);
      const room = rooms.get(roomID);
      if (!result) return;

      io.to(roomID).emit("turn-started", {
        drawerID: result.drawerID,
        wordLength: result.wordLength,
        hint: result.hint,
        round: room.round,
        totalRounds: room.totalRounds,
      });

      startTimer(roomID, io, () => handleTurnEnd(roomID));
    });

    //chat-logic
    socket.on("chat-message", ({ roomID, message, username }) => {
      const room = rooms.get(roomID);
      if (!room || !room.currentWord) {
        io.to(roomID).emit("chat-message", { username, message });
        return;
      }

      const result = checkGuess(roomID, socket.id, message);

      if (result.correct) {
        const room = rooms.get(roomID);
        const guesser = room.players.find((p) => p.id === socket.id);
        if (guesser) {
          guesser.score += Math.round((room.timeLeft / 80) * 500) + 100;
        }

        const drawer = room.players[room.currentDrawerIndex];
        if (drawer) {
          drawer.score += Math.round((room.timeLeft / 80) * 50) + 20;
        }

        io.to(roomID).emit("room-players", room.players);

        io.to(roomID).emit("player-guessed", { username });
        socket.emit("correct-guess");

        if (result.allGuessed) {
          handleTurnEnd(roomID);
        }
      } else {
        io.to(roomID).emit("chat-message", { username, message });
      }
    });

    //drawing-sharing
    socket.on("draw-start", (data) =>
      socket.to(data.roomID).emit("draw-start", data),
    );
    socket.on("draw-move", (data) =>
      socket.to(data.roomID).emit("draw-move", data),
    );
    socket.on("draw-fill", (data) =>
      socket.to(data.roomID).emit("draw-fill", data),
    );
    socket.on("draw-clear", (data) =>
      socket.to(data.roomID).emit("draw-clear", data),
    );

    socket.on("disconnect", () => {
      for (const roomID of rooms.keys()) {
        const wasHost = rooms.get(roomID)?.host === socket.id;
        const room = removePlayer(roomID, socket.id);
        if (room) {
          io.to(roomID).emit("room-players", room.players);
          if (wasHost && room.players.length > 0) reassignHost(roomID);
        }
      }
      io.emit("online-count", { count: io.engine.clientsCount });
    });
  });
}
