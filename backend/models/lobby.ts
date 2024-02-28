import { CreateRoomRequest, LeaveRoom, LobbyModel, LoginRequest, LoginStatus, Player, RoomInfoRequest, RoomModel, tryRoomJoin } from '../../shared/types'
import { Server } from 'socket.io'
import { Room } from './room'
import {Socket} from 'socket.io'
import cookie from 'cookie'
import { Express } from 'express-serve-static-core'
import { randomUUID } from 'crypto'


type PlayerInfo = {
    player: Player
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
            this.playerInfo.set(sid, {player: {username: req.body.username}, socket: null})
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
                    players.push({username: playerInfo.player.username})
                }

                for (const [username, pif] of this.playerInfo) {
                    pif.socket?.emit('lobbyModel', {players: players, rooms: this.rooms.map(r => r.toModel())})
                }
            })

            socket.on('getLobbyModel', () => {
                let players: Player[] = []

                for (const [sid, playerInfo] of this.playerInfo) {
                    players.push({username: playerInfo.player.username})
                }

                socket.emit('lobbyModel', {players: players, rooms: this.rooms.map(r => r.toModel())} as LobbyModel)
            })

            socket.on('createRoom', (cr: CreateRoomRequest) => {

                let players: Player[] = []

                for (const [sid, playerInfo] of this.playerInfo) {
                    players.push({username: playerInfo.player.username})
                }

                let roomOwner = players.find((p: Player) => p.username === cr.owner.username)
                if (roomOwner) {
                    let room = new Room(this.id, roomOwner)
                    if (cr.password) {
                        room.pass = cr.password
                    }
                    this.rooms.push(room)
                    console.log(room)
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
                        let sid = cookie.parse(socket.request.headers.cookie as string)['sid']
                        let pif = this.playerInfo.get(sid)
                        room.players.push(pif?.player as Player)
                        socket.join(trj.id.toString())
                        io.to(trj.id.toString()).emit('RoomModel', room.toModel())
                        socket.emit("tryRoomJoinResponse", {success: true, id: room.id})
                    } else {
                        socket.emit('tryRoomJoinResponse', {success: false, id: room.id})
                    }
                }
            })

            socket.on('getRoomInfo', (rir: RoomInfoRequest) => {
                let room = this.rooms.find((r: Room) => r.id === rir.rid)
                socket.emit('RoomModel', 
                   room?.toModel()
                )
            })


            socket.on('leaveRoom', (l : LeaveRoom) => {
                let room = this.rooms.find((r: Room) => l.rid === r.id)
                if (room) {
                    let playername = ""
                    for (const [sid, playerinfo] of this.playerInfo) {
                        if (playerinfo.socket?.id === socket.id) {
                            playername = playerinfo.player.username
                            break
                        }
                    }
                    console.log(`player ${playername} is leaving room`)
                    room.players = room?.players.filter((p: Player) => p.username !== playername)
                    console.log(`players in room are now`)
                    console.log(room.players)
                    io.to(l.rid.toString()).emit('RoomModel', room?.toModel())
                }
            })

        })
    }
}