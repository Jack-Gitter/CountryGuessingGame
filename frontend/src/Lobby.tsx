import { useContext, useEffect, useState } from "react"
import { LobbyModel, Player as PlayerModel, RoomModel, tryRoomJoin, tryRoomJoinResponse } from "../../shared/types"
import { CreateRoomRequest } from "../../shared/types"
import { useNavigate } from "react-router-dom"
import { Socket, io } from "socket.io-client";
import { ourPlayerContext } from "./App";

let usersocket: Socket

function Lobby() {

    let ourPlayer = useContext(ourPlayerContext)

    useEffect(() => {
        usersocket = io('http://127.0.0.1:8080', {withCredentials: true}) 
        ourPlayer.socket = usersocket
    }, [])

    const navigate = useNavigate()
    let [players, setPlayers] = useState<PlayerModel[]>([])
    let [rooms, setRooms] = useState<RoomModel[]>([])
    let [pass, setPass] = useState("")
    let [passAttempts, setPassAttempts] = useState<Map<number, string>>(new Map())

    useEffect(() => {
        usersocket.emit('getLobbyModel')
        usersocket.on('lobbyModel', (lm: LobbyModel) => {
            setPlayers(lm.players)
            setRooms(lm.rooms)
        })
        usersocket.on('lobbyChanged', (l: LobbyModel) => {
            console.log("new lobby is")
            console.log(l)
            setRooms(l.rooms)
            setPlayers(l.players)
        })
        usersocket.on('tryRoomJoinResponse', (obj: tryRoomJoinResponse) => {
            if (obj.success) {
                navigate(`/room/${obj.id}`)
            } else {
                console.log('wrong password')
            }
        })
    }, [])

    const createNewRoom = (roomPassword?: string) => {
        let crr: CreateRoomRequest = {
            owner: {username: ourPlayer.username}
        }
        if (roomPassword) {
            crr.password = roomPassword
        }
        usersocket.emit('createRoom', crr)
    }

    const deleteRoom = (id: number) => {
        usersocket.emit("deleteRoom", id)
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
                        <button onClick={() => {usersocket.emit('tryRoomJoin', {id: r.id, pass: passAttempts.get(r.id)} as tryRoomJoin)}}>Join Room</button>
                        {r.password ? <input onChange={((e) => {
                            passAttempts.set(r.id, e.target.value)
                            setPassAttempts(passAttempts)
                        })}></input>: <></>}
                        {r.owner.username === ourPlayer.username ? <button onClick={() => deleteRoom(r.id)}>deleteRoom</button> : <></>}
                    </>
                    )
                })}
            </ul>
            {rooms.length}
        </>
    )
}

export default Lobby
export {usersocket}