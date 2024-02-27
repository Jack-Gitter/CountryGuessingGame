import express, { Express } from "express";
import http from "http"
import { Server } from "socket.io";
import cors, { CorsOptions } from "cors";
import { Lobby } from "./models/lobby";


const app = express();

app.use(cors({
  credentials: true,
  origin: "http://127.0.0.1:3000"
}))

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    credentials: true,
    origin: "http://127.0.0.1:3000"
  },
  cookie: {
    name: "sid"
  }

})

const lobby = new Lobby()

lobby.handlePlayerConnection(io)


app.get('/login', (req, res) => {
  res.send('success')
})

server.listen(8080, () => {
    console.log('listening on port 8080')
})


