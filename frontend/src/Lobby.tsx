import { useContext, useEffect, useState } from "react"
import { socketContext } from "./App"
import { LobbyModel, Player as PlayerModel, Room } from "../../shared/types"
import { CreateRoomRequest } from "../../shared/types"
import { ourPlayerContext } from "./App"
import { Player } from "./player"
import { useNavigate } from "react-router-dom"

function Lobby() {
    // on this page, we need to request the lobby model, so we can update the frontend

    const navigate = useNavigate()
    let socket = useContext(socketContext)
    let [players, setPlayers] = useState<PlayerModel[]>([])
    let [rooms, setRooms] = useState<Room[]>([])
    const ourPlayer = useContext(ourPlayerContext)

    useEffect(() => {
        socket.emit('getLobbyModel')
        socket.on('lobbyModel', (lm: LobbyModel) => {
            setPlayers(lm.players)
            setRooms(lm.rooms)
        })
        socket.on('lobbyChanged', (l: LobbyModel) => {
            setRooms(l.rooms)
            setPlayers(l.players)
        })
    })

    const createNewRoom = () => {
        socket.emit('createRoom', {owner: ourPlayer.username} as CreateRoomRequest)
    }

    return (
        <>
            {ourPlayer.username}
            <button onClick={createNewRoom}>Make room</button>
            {players.length}
            <br/>
            <ul>
                {rooms.map((r: Room) => {
                    return (
                    <>
                        <li>{r.id}</li>
                        <button onClick={() => navigate(`/room/${r.id}`)}>Join Room</button>
                    </>
                    )
                })}
            </ul>
            {rooms.length}
        </>
    )
}

export default Lobby