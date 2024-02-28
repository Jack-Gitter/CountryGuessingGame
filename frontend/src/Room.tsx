import { useParams } from "react-router-dom"
import { usersocket } from "./Lobby"
import { useEffect, useState } from "react"
import { LeaveRoom, Player, RoomInfoRequest, RoomModel } from "../../shared/types"
import { useNavigate } from "react-router-dom"

function Room() {

    const navigate = useNavigate()
    const { id } = useParams()
    let [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        if (id) {
            usersocket.emit('getRoomInfo', {rid: Number(id)} as RoomInfoRequest)
        }
        usersocket.on('RoomModel', (rm: RoomModel) => {
            let newArr: Player[] = [...rm.players]
            setPlayers(newArr)
        }) 
    }, [])


    const leaveRoom = () => {
        usersocket.emit('leaveRoom', {rid: Number(id)} as LeaveRoom)
        navigate('/lobby')
    }

    return (
        <>
        { players ?  players.map((p: Player) => { return <li>{p.username}</li>}) : <></> }
        <div>You are in room {id}</div>
        <button onClick={leaveRoom}>Leave Room</button>
        </>

    )
}

export default Room