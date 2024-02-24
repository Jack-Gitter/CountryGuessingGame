// make the creatRoomRequest send a just the username of the player 
// and their socket

export type Player = {
   username: string, 
   password: string,
}

export type LoginRequest = {
   username: string,
   pass: string
}

export type CreateRoomRequest = {
   owner: string
   password?: string
}

export type LoginStatus = {
   success: boolean
}

export type RoomModel = {
   id: number,
   players: Player[]
   password?: boolean
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