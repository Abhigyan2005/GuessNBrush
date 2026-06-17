# GuessNBrush

A real-time multiplayer drawing and guessing game. Players take turns drawing a secret word while others race to guess it in the chat.

🔗 **[Live Demo](https://guess-n-brush.vercel.app/)**

---

## Tech Stack

- **Frontend** — React, Vite, Tailwind CSS
- **Backend** — Node.js, Express, Socket.io
- **DevOps & Containers** — Docker, Docker Compose
- **Deployment** — Vercel (frontend), Render (backend managed via Docker)

---

## Features

- Public rooms — auto-matchmaking, game starts when 2+ players join
- Private rooms — create a room, share the code, host starts the game
- Real-time canvas sync — brush, eraser, flood fill, clear tools
- Word selection with 30s auto-pick if drawer is idle
- 80s turn timer with progressive hint reveals at 60s, 40s, 20s
- Score system — faster guesses earn more points
- Host reassignment when host disconnects
- Live online player counter

---

## Run Locally

### 🐳 Option 1: Using Docker
You can spin up the entire full-stack ecosystem (Frontend, Backend, and Networking) with a single command using Docker.

**1. Clone the repo**
```bash
git clone [https://github.com/Abhigyan2005/GuessNBrush](https://github.com/Abhigyan2005/GuessNBrush)
cd GuessNBrush
```
**2. Boot the environment**

```bash
docker compose up --build
```


### 🛠️ Option 2: Manual Way

**Backend**

```bash
cd Backend
npm install
npm run start
```

**Frontend**

```bash
cd GuessNBrush
npm install
npm run dev
```

Open http://localhost:5173 in two tabs and join the same room to test.

### Project Structure

```
guessnbrush/
├── Backend/
│   ├── index.js             
│   ├── socketHandler.js     
│   ├── roomManager.js       
│   ├── gameManager.js       
│   ├── Dockerfile          
│   └── utilities/
│       ├── words.js         
│       └── generateRoomId.js
│
├── GuessNBrush/             
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   └── GameRoom.jsx
│   │   ├── components/
│   │   │   ├── Canvas.jsx
│   │   │   ├── ChatPanel.jsx
│   │   │   └── ...
│   │   └── utilities/
│   │       ├── socket.js   
│   │       └── CanvasTool.js
│   └── Dockerfile           
│
└── docker-compose.yml      
```

## Screenshots

![alt text](image.png)