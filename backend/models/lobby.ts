import { CreateRoomRequest, LobbyModel, LoginRequest, LoginStatus, Player, RoomModel, tryRoomJoin } from '../../shared/types'
import { Server } from 'socket.io'
import { Room } from './room'
import {Socket} from 'socket.io'
import cookie from 'cookie'
import { Express } from 'express-serve-static-core'
import { randomUUID } from 'crypto'


type PlayerInfo = {
    username: string
    password: string
    socket: Socket | null
}
export class Lobby {

    playerInfo: Map<string, PlayerInfo>
    rooms: Room[]
    id: number

    constructor() {
        this.rooms = []
        this.playerInfo = new Map()
        this.id = 0
    }

    handlePlayerConnection(io: Server, app: Express) {

        app.post('/login', (req, res) => {
            let sid = randomUUID()
            this.playerInfo.set(sid, {username: req.body.username, password: req.body.password, socket: null})
            res.cookie('sid', sid)
            res.json({username: req.body.username, password: req.body.password})
        })

        io.on('connection', (socket) => {
            
            let sid = cookie.parse(socket.request.headers.cookie as string)['sid']

            if (sid) {
                if (this.playerInfo.has(sid)) {
                    let pif = this.playerInfo.get(sid) as PlayerInfo
                    pif.socket = socket
                } else {
                    socket.send(new Error('busted!!!'))
                }
            }

            socket.on('deleteRoom', (id: number) => {
                this.rooms = this.rooms.filter((r) => r.id !== id)

                let players: Player[] = []

                for (const [sid, playerInfo] of this.playerInfo) {
                    players.push({username: playerInfo.username})
                }

                for (const [username, pif] of this.playerInfo) {
                    pif.socket?.emit('lobbyModel', {players: players, rooms: this.rooms.map(r => r.toModel())})
                }
            })

            socket.on('getLobbyModel', () => {
                let players: Player[] = []

                for (const [sid, playerInfo] of this.playerInfo) {
                    players.push({username: playerInfo.username})
                }

                socket.emit('lobbyModel', {players: players, rooms: this.rooms.map(r => r.toModel())} as LobbyModel)
            })

            socket.on('createRoom', (cr: CreateRoomRequest) => {

                console.log(cr)
                let players: Player[] = []

                for (const [sid, playerInfo] of this.playerInfo) {
                    players.push({username: playerInfo.username})
                }

                let roomOwner = players.find((p: Player) => p.username === cr.owner.username)
                console.log(`room owner is ${roomOwner}`)
                if (roomOwner) {
                    let room = new Room(this.id, roomOwner)
                    if (cr.password) {
                        room.pass = cr.password
                    }
                    this.rooms.push(room)
                    this.id+=1
                    for (const [username, pif] of this.playerInfo) {
                        pif.socket?.emit('lobbyChanged', {players: players, rooms: this.rooms.map(r => r.toModel())} as LobbyModel)
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