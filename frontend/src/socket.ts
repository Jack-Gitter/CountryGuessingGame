import { io } from "socket.io-client";

const URL = "http://localhost:8080"

export const socket = io(URL, {
    reconnectionDelay: 1000,
    reconnection: true,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false
});
