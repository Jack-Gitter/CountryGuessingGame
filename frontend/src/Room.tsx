import { useParams } from "react-router-dom"
import { usersocket } from "./Lobby"
import { useEffect, useState } from "react"
import { Player, RoomInfoRequest, RoomModel } from "../../shared/types"

function Room() {

    const { id } = useParams()
    let [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        if (id) {
            usersocket.emit('getRoomInfo', {rid: Number(id)} as RoomInfoRequest)
        }
        usersocket.on('RoomModel', (rm: RoomModel) => {
        }) 
    }, [])

    return (
        <>
        {players ? players.map((p: Player) => {
            <li>{p.username}</li>
        }): <></>}
        <div>You are in room {id}</div>
        </>

    )
}

export default Room