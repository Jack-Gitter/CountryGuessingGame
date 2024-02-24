import { useContext, useEffect, useState } from "react"
import { LoginRequest, LoginStatus } from "../../shared/types"
import { useNavigate } from "react-router-dom"
import { ourPlayerContext, socketContext } from "./App"
import { createContext } from "react"
import { Player } from "./player"


function Login() {

    const socket = useContext(socketContext)
    let [username, setUsername] = useState('')
    let [pass, setPass] = useState('')
    let ourPlayer = useContext(ourPlayerContext)
    let navigate = useNavigate()

    useEffect(() => {
        socket.on('loginStatus', (ls: LoginStatus) => {
            if (ls.success) {
                ourPlayer.username = username
                navigate(`/lobby`)
                // navigate to the lobby screen, and send lobby from backend
            } else {
                // show a toast
            }
        })
    })
    const login = () => {
        let lr: LoginRequest = {
            username: username,
            pass: pass
        }
        socket.emit('login', lr)
    }

    return (
        <div>
            <input onChange={(e) => setUsername(e.target.value)}></input>
            <input onChange={(e) => setPass(e.target.value)}></input>
            <button onClick={login}>sign in</button>
        </div>
    )

}

export default Login