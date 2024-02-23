import { LobbyModel, LoginRequest, LoginStatus, Player, Room } from '../../shared/types'
import { Server } from 'socket.io'

export class Lobby {

    players: Player[]
    rooms: Room[]
    id: number

    constructor() {
        this.players = []
        this.rooms = []
        this.id = 0
    }

    handlePlayerConnection(io: Server) {
        io.on('connection', (socket) => {
            socket.on('login', (lr: LoginRequest) => {
                this.players.push({username: lr.username, password: lr.pass})
                this.id+=1
                socket.emit('loginStatus', {success: true} as LoginStatus )
                // also emit the lobby model to everyone, so that they can update 
                // and know that this
            })
            socket.on('signup', () => {
                //
            })
            socket.on('getLobbyModel', () => {
                socket.emit('lobbyModel', {players: this.players, rooms: this.rooms} as LobbyModel)
            })
        })
    }
}