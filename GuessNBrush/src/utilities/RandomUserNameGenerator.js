const adjectives = [
  "Crazy",
  "Wacky",
  "Sneaky",
  "Spicy",
  "Goofy",
  "Jumpy",
  "Silly",
  "Cheeky",
  "Bouncy",
  "Quirky",
];

const nouns = [
  "Monkey",
  "Unicorn",
  "Pirate",
  "Zombie",
  "Ninja",
  "Wizard",
  "Robot",
  "Dragon",
  "Penguin",
  "Sloth",
];


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateUsername() {
  const adj = adjectives[getRandomInt(0, adjectives.length)];
  const noun = nouns[getRandomInt(0, nouns.length)];
  const number = getRandomInt(0, 100); 
  return `${adj}${noun}${number}`;
}