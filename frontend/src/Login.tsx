import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ourPlayerContext } from "./App"


function Login() {

    let ourPlayer = useContext(ourPlayerContext)

    let [username, setUsername] = useState('')
    let [pass, setPassword] = useState('')
    let navigate = useNavigate()

    const login = async () => {

        let res = await axios.post('http://127.0.0.1:8080/login', {username: username, password: pass}, {withCredentials: true})

        if (res.status === 200) {
            ourPlayer.username = res.data.username
            console.log(ourPlayer)
            navigate('/lobby')
        } else {
            // show toast that you have an invalid login
        }
    }

    return (
        <div>
            <input onChange={(e) => setUsername(e.target.value)}></input>
            <input onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={login}>sign in</button>
        </div>
    )

}

export default Login