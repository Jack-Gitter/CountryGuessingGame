import { CreateRoomRequest, LobbyModel, LoginRequest, LoginStatus, Player, RoomModel, tryRoomJoin } from '../../shared/types'
import { Server } from 'socket.io'
import { Room } from './room'
import {Socket} from 'socket.io'

export class Lobby {

    players: Player[]
    playerSockets: Map<string, Socket>
    rooms: Room[]
    id: number

    constructor() {
        this.players = []
        this.rooms = []
        this.playerSockets = new Map()
        this.id = 0
    }

    handlePlayerConnection(io: Server) {
        io.on('connection', (socket) => {
            socket.on('login', (lr: LoginRequest) => {
                this.players.push({username: lr.username, password: lr.pass} as Player)
                this.playerSockets.set(lr.username, socket)
                socket.emit('loginStatus', {success: true} as LoginStatus )
            })
            socket.on('signup', () => {
                //
            })
            socket.on('deleteRoom', (id: number) => {
                this.rooms = this.rooms.filter((r) => r.id !== id)
                for (const [username, playerSocket] of this.playerSockets) {
                    playerSocket.emit('lobbyModel', {players: this.players, rooms: this.rooms.map(r => r.toModel())})
                }
            })
            socket.on('getLobbyModel', () => {
                socket.emit('lobbyModel', {players: this.players, rooms: this.rooms.map(r => r.toModel())} as LobbyModel)
            })
            socket.on('createRoom', (cr: CreateRoomRequest) => {
                let roomOwner = this.players.find((p: Player) => p.username === cr.owner)
                if (roomOwner) {
                    let room = new Room(this.id, roomOwner)
                    if (cr.password) {
                        room.pass = cr.password
                    }
                    this.rooms.push(room)
                    this.id+=1
                    for (const [username, playerSocket] of this.playerSockets) {
                        playerSocket.emit('lobbyChanged', {players: this.players, rooms: this.rooms.map(r => r.toModel())} as LobbyModel)
                    }
                }
            })
            socket.on('tryRoomJoin', (trj: tryRoomJoin) => {
                let room = this.rooms.find((r) => r.id === trj.id)
                if (room) {
                    if (!room.pass || room.pass && trj.pass === room.pass) {
                        socket.emit("tryRoomJoinResponse", {success: true, id: room.id})
                    } else {
                        socket.emit('tryRoomJoinResponse', {success: false, id: room.id})
                    }
                }
            })
        })
    }
}