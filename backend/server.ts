import express, { Express } from "express";
import { Server } from "socket.io";
import cors, { CorsOptions } from "cors";
import http from "http"
import { Lobby } from "./models/lobby";

const app: Express = express();

app.use(cors())

const server = http.createServer(app)
const io = new Server(server)

const lobby = new Lobby()

lobby.handlePlayerConnection(io)

io.listen(8080)