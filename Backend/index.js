import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setupSockets } from "./sockethandler.js";
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


setupSockets(io);

server.listen(3000, () => {
  console.log("server is running");
});
