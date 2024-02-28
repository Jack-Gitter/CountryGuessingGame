// make the creatRoomRequest send a just the username of the player 
// and their socket
import {Socket} from 'socket.io'

export type Player = {
   username: string, 
}

export type LoginRequest = {
   username: string,
   pass: string
}

export type CreateRoomRequest = {
   owner: Player
   password?: string
}

export type LoginStatus = {
   success: boolean
}

export type RoomModel = {
   owner: Player,
   id: number,
   players: Player[]
   password?: boolean
}

export type LeaveRoom = {
   rid: number
}

export type LobbyModel = {
   players: Player[]
   rooms: RoomModel[]
}


export type tryRoomJoin = {
   id: number
   pass?: string
}

export type tryRoomJoinResponse = {
   success: boolean, 
   id:number
}

export type RoomInfoRequest = {
   rid: number
}