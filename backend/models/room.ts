import { Player } from "../../shared/types"

export class Room {
    id: number
    players: Player[]
    constructor(id: number, owner: Player) {
        this.id = id
        this.players = [owner]
    }
}