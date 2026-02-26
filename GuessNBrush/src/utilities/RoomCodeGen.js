
const activeRooms = new Set();


function generateRandomId(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createRoomId() {
  let newId;
  do {
    newId = generateRandomId();
  } while (activeRooms.has(newId)); 

  activeRooms.add(newId); 
  return newId;
}

export function removeRoomId(roomId) {
  activeRooms.delete(roomId);
}

export function isRoomActive(roomId) {
  return activeRooms.has(roomId);
}