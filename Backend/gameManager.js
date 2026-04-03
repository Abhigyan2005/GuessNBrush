import { getRandomWords } from "./utilities/words.js";
import { rooms } from "./roomManager.js";

export function StartTurn(roomID) {
  const room = rooms.get(roomID);
  if (!room) return null;
  const drawer = room.players[room.currentDrawerIndex];
  if (!drawer) return null;
  const wordChoices = getRandomWords(room.usedWords, 3);

  return { drawer, wordChoices };
}

export function chooseWord(roomID, word) {
  const room = rooms.get(roomID);
  if (!room) return null;

  room.currentWord = word;
  room.currentHint = Array(word.length).fill("_");
  room.usedWords.add(word.toLowerCase());

  return {
    drawerID: room.players[room.currentDrawerIndex].id,
    wordLength: word.length,
    hint: room.currentHint.map((c) => (c === " " ? " " : "_")).join(" "),
  };
}

export function checkGuess(roomID, playerID, guess) {
  const room = rooms.get(roomID);
  if (!room) return null;

  const isCorrect = guess.toLowerCase() === room.currentWord.toLowerCase();
  const alreadyGuessed = room.guessedPlayers.has(playerID);

  if (isCorrect && !alreadyGuessed) {
    room.guessedPlayers.add(playerID);

    return {
      correct: true,
      allGuessed: room.guessedPlayers.size === room.players.length - 1,
    };
  }

  return { correct: false };
}

export function endTurn(roomID) {
  const room = rooms.get(roomID);
  if (!room) return null;

  const word = room.currentWord;

  room.currentWord = null;
  room.guessedPlayers.clear();
  room.currentDrawerIndex++;

  if (room.currentDrawerIndex >= room.players.length) {
    room.currentDrawerIndex = 0;
    room.round++;

    if (room.round > room.totalRounds) {
      return { status: "game-over", word };
    }
    return { status: "round-over", word };
  }

  return { status: "next-turn", word };
}

export function startTimer(roomID, io, onEnd) {
  const room = rooms.get(roomID);
  if (!room) return;
  if (room.timer) return;
  room.timeLeft = 80;

  room.timer = setInterval(() => {
    room.timeLeft--;

    io.to(roomID).emit("timer-tick", { timeLeft: room.timeLeft });

    if (room.timeLeft === 60 || room.timeLeft === 40 || room.timeLeft === 20) {
      const hint = revealHint(roomID);
      io.to(roomID).emit("hint-update", { hint });
    }

    if (room.timeLeft <= 0) {
      clearInterval(room.timer);
      room.timer = null;
      onEnd();
    }
  }, 1000);
}

export function stopTimer(roomID) {
  const room = rooms.get(roomID);
  if (!room) return;
  clearInterval(room.timer);
  room.timer = null;
}

function revealHint(roomID) {
  const room = rooms.get(roomID);
  if (!room || !room.currentWord) return "";

  if (!room.currentHint) {
    room.currentHint = Array(room.currentWord.length).fill("_");
  }

  const hidden = room.currentWord
    .split("")
    .map((char, i) => (room.currentHint[i] === "_" ? i : null))
    .filter((i) => i !== null && room.currentWord[i] !== " ");

  if (hidden.length === 0) return room.currentHint.join(" ");

  const randIndex = hidden[Math.floor(Math.random() * hidden.length)];
  room.currentHint[randIndex] = room.currentWord[randIndex];

  return room.currentHint.join(" ");
}
