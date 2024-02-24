import { CreateRoomRequest, LobbyModel, LoginRequest, LoginStatus, Player, Room as RoomModel } from '../../shared/types'
import { Server } from 'socket.io'
import { Room } from './room'

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
                this.players.push({username: lr.username, password: lr.pass} as Player)
                socket.emit('loginStatus', {success: true} as LoginStatus )
            })
            socket.on('signup', () => {
                //
            })
            socket.on('getLobbyModel', () => {
                socket.emit('lobbyModel', {players: this.players, rooms: this.rooms} as LobbyModel)
            })
            socket.on('createRoom', (cr: CreateRoomRequest) => {
                let roomOwner = this.players.find((p: Player) => p.username === cr.owner)
                if (roomOwner) {
                    this.rooms.push(new Room(this.id, roomOwner))
                    this.id+=1
                    socket.emit('lobbyChanged', {players: this.players, rooms: this.rooms} as LobbyModel)
                }
            })
        })
    }
}