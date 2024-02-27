import { useContext, useEffect, useState } from "react"
import { LoginRequest, LoginStatus } from "../../shared/types"
import { useNavigate } from "react-router-dom"
import { createContext } from "react"
import { Player } from "./player"
import axios from "axios"


function Login() {

    let [username, setUsername] = useState('')
    let [pass, setPass] = useState('')
    let navigate = useNavigate()

    const login = async () => {
        let resp = await axios.get('http://127.0.0.1:8080/login')
        console.log(resp)
        await axios.get('http://127.0.0.1:8080/socket.io/?EIO=4&transport=polling')
        navigate('/lobby')
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