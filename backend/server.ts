import express from 'express'
import http from "http"
import { Server } from "socket.io";
import cors from 'cors'
import { Lobby } from "./models/lobby";

const app = express();

app.use(cors({
  origin: "http://127.0.0.1:3000",
  credentials: true
}))

app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    credentials: true,
    origin: "http://127.0.0.1:3000"
  },
})

const lobby = new Lobby()

lobby.handlePlayerConnection(io, app)

server.listen(8080, () => {
    console.log('listening on port 8080')
})


