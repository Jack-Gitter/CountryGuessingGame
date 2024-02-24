import { Player, RoomModel } from "../../shared/types"

export class Room {
    id: number
    players: Player[]
    pass?: string
    constructor(id: number, owner: Player, pass?: string) {
        this.id = id
        this.players = [owner]
        if (pass) {
            this.pass = pass
        }
    }
    toModel(): RoomModel {
        let hasPass = this.pass === undefined ? false : true
        return {
            id: this.id,
            players: this.players,
            password : hasPass
        }
    }
}