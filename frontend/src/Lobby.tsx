import { useContext, useEffect, useState } from "react"
import { socketContext } from "./App"
import { LobbyModel, Player as PlayerModel, RoomModel, tryRoomJoin, tryRoomJoinResponse } from "../../shared/types"
import { CreateRoomRequest } from "../../shared/types"
import { ourPlayerContext } from "./App"
import { Player } from "./player"
import { useNavigate } from "react-router-dom"

function Lobby() {
    // on this page, we need to request the lobby model, so we can update the frontend

    const navigate = useNavigate()
    let socket = useContext(socketContext)
    let [players, setPlayers] = useState<PlayerModel[]>([])
    let [rooms, setRooms] = useState<RoomModel[]>([])
    let [pass, setPass] = useState("")
    let [passAttempts, setPassAttempts] = useState<Map<number, string>>(new Map())

    const ourPlayer = useContext(ourPlayerContext)

    useEffect(() => {
        socket.emit('getLobbyModel')
        socket.on('lobbyModel', (lm: LobbyModel) => {
            setPlayers(lm.players)
            setRooms(lm.rooms)
        })
        socket.on('lobbyChanged', (l: LobbyModel) => {
            console.log("new lobby is")
            console.log(l)
            setRooms(l.rooms)
            setPlayers(l.players)
        })
        socket.on('tryRoomJoinResponse', (obj: tryRoomJoinResponse) => {
            if (obj.success) {
                navigate(`/room/${obj.id}`)
            } else {
                console.log('wrong password')
            }
        })
    }, [])

    const createNewRoom = (roomPassword?: string) => {
        let crr: CreateRoomRequest = {
            owner: ourPlayer.username
        }
        if (roomPassword) {
            crr.password = roomPassword
        }
        socket.emit('createRoom', crr)
    }

    return (
        <>
            {ourPlayer.username}
            <button onClick={() => createNewRoom()}>Make public room</button>
            <button onClick={() => 
                {
                    if (pass.length > 5) {
                        createNewRoom(pass) 
                    }
                }
                }>Make Private Room</button>
            <input onChange={(e) => {setPass(e.target.value)}}></input>
            {players.length}
            <br/>
            <ul>
                {rooms.map((r: RoomModel) => {
                    return (
                    <>
                        <li>{r.id}</li>
                        <button onClick={() => {socket.emit('tryRoomJoin', {id: r.id, pass: passAttempts.get(r.id)} as tryRoomJoin)}}>Join Room</button>
                        {r.password ? <input onChange={((e) => {
                            passAttempts.set(r.id, e.target.value)
                            setPassAttempts(passAttempts)
                        })}></input>: <></>}
                    </>
                    )
                })}
            </ul>
            {rooms.length}
        </>
    )
}

export default Lobby