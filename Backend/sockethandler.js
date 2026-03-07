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
    const turnResult = endTurn(roomID);

    io.to(roomID).emit("turn-ended", { word: turnResult.word });

    setTimeout(() => {
      if (turnResult.status === "game-over") {
        const winner = [...room.players].sort((a, b) => b.score - a.score)[0];
        io.to(roomID).emit("game-over", {
          players: room.players,
          winner: winner.username,
        });
      } else {
        handleStartTurn(roomID);
      }
    }, 3000);
  }

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

      if (room.type === "public" && room.players.length >= 2) {
        room.gameStarted = true;
        io.to(roomID).emit("game-started");
        handleStartTurn(roomID);
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

      if (room.type === "public" && room.players.length >= 2) {
        room.gameStarted = true;
        io.to(room).emit("game-started");
        handleStartTurn(roomID);
      }
    });


    //private rooom
    socket.on("create-private-room", ({ username }) => {
      const roomID = CreatePrivateRoom(socket.id);

      if(!roomID){
        return null;
      }

      const room = addPlayerToRoom(roomID, {
        id: socket.id,
        username,
        score:0
      })

      socket.emit("joined-private-room", { roomID });
    })

    socket.on("leave-room", ({ roomID }) => {
      const room = removePlayer(roomID, socket.id);
      if (room) io.to(roomID).emit("room-players", room.players);
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
        io.to(roomID).emit("player-guessed", { username });
        socket.emit("correct-guess");

        if (result.allGuessed) {
          handleTurnEnd(roomID);
        }
      } else {
        io.to(roomID).emit("chat-message", { username, message });
      }
    });

    socket.on("disconnect", () => {
      for (const roomID of rooms.keys()) {
        const room = removePlayer(roomID, socket.id);
        if (room) io.to(roomID).emit("room-players", room.players);
      }
    });
  });
}
