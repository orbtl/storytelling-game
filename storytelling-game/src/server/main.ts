import express from "express";
import ViteExpress from "vite-express";
import makeSocketServer from "./sockets/socketServer.js";

makeSocketServer();

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
