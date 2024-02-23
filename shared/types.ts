export type Player = {
   username: string, 
   password: string,
}

export type LoginRequest = {
   username: string,
   pass: string
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