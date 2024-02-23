import { useContext, useEffect, useState } from "react"
import { socketContext } from "./App"
import { LobbyModel, Player, Room } from "../../shared/types"

function Lobby() {
    // on this page, we need to request the lobby model, so we can update the frontend

    let socket = useContext(socketContext)
    let [players, setPlayers] = useState<Player[]>([])
    let [rooms, setRooms] = useState<Room[]>([])

    useEffect(() => {
        socket.emit('getLobbyModel')
        socket.on('lobbyModel', (lm: LobbyModel) => {
            setPlayers(lm.players)
            setRooms(lm.rooms)
        })
    })

    return (
        <>
            {players.length}
            <br/>
            {rooms.length}
        </>
    )
}

export default Lobby