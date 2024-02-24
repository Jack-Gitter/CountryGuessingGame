import { Socket } from 'socket.io-client'

export class Player {

    username: string
    socket: Socket

    constructor(username: string, socket: Socket) {
        this.username = username
        this.socket = socket
    }

}