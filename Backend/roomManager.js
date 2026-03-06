import { createRoomId } from "./utilities/generateRoomId.js";

export const publicRooms = [];
export const rooms = new Map();
export const MAX_PUBLIC_PLAYERS = 4;

export function CreatePublicRoom(hostId) {
  const roomID = createRoomId();
  const room = {
    type: "public",
    players: [],
    gameStarted: false,
    host: hostId,
    currentDrawerIndex: 0,
    currentWord: null,
    round: 1,
    totalRounds: 3,
    guessedPlayers: new Set(),
    timer: null,
    usedWords: new Set(), 
  };

  rooms.set(roomID, room);
  publicRooms.push(roomID);
  return roomID;
}

export function addPlayerToRoom(roomID, player) {
  const room = rooms.get(roomID);
  if (!room) return false;

  const exists = room.players.some((p) => p.id === player.id);

  if (!exists) room.players.push(player);
  return room;
}

export function removePlayer(roomID, playerID) {
  const room = rooms.get(roomID);
  if (!room) return false;

  room.players = room.players.filter((p) => p.id !== playerID);

  if (room.players.length === 0) {
    if (room.type === "public") {
      setTimeout(() => {
        const r = rooms.get(roomID);
        if (r && r.players.length === 0) {
          rooms.delete(roomID);
          const index = publicRooms.indexOf(roomID);
          if (index !== -1) publicRooms.splice(index, 1);
        }
      }, 10000);
    } else {
      rooms.delete(roomID);
    }
  }
  return room;
}

export function FindAvailablePublicRoom() {
  let room;
  const roomID = publicRooms.find((id) => {
    room = rooms.get(id);
    return room && room.players.length < MAX_PUBLIC_PLAYERS;
  });
  return roomID;
}
