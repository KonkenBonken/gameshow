import express from "express";
import { promises as fs } from "fs";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);
const io = new Server(server);

const game = {
  score: { a: 0, b: 0 },
};

app.get(/\/[ab]$/, async (req, res) => {
  res.type("html").send(await fs.readFile("client/score.html"));
});

app.get("/control", async (req, res) => {
  res.type("html").send(await fs.readFile("client/control.html"));
});

io.on("connection", (socket) => {
  console.log("a client connected");
  io.emit("score", game.score);

  socket.on("score", ([team, d = 0]) => {
    game.score[team] += d;
    io.emit("score", game.score);
  });

  socket.on("err", (team) => {
    io.emit("err", team);
  });
});

server.listen(80, () => {
  console.log(`Example app listening on port 80`);
});
