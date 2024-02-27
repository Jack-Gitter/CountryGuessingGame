import { Socket } from 'socket.io-client'

export class Player {

    username: string
    socket: Socket | null

    constructor(username: string, socket: Socket | null) {
        this.username = username
        this.socket = socket
    }

}