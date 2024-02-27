import express, { Express } from "express";
import http from "http"
import { Server } from "socket.io";
import cors, { CorsOptions } from "cors";
import { Lobby } from "./models/lobby";


const app = express();

app.use(cors({
  credentials: true,
}))

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log("socket connected")
})

server.listen(8080, () => {
    console.log('listening on port 8080')
})

/*const lobby = new Lobby()

lobby.handlePlayerConnection(io)

io.listen(8080)*/