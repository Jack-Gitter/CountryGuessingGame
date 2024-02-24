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
}

export type LoginStatus = {
   success: boolean
}

export type Room = {
   id: Number,
   players: Player[]
}

export type LobbyModel = {
   players: Player[]
   rooms: Room[]
}