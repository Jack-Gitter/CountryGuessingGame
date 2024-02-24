import { useParams } from "react-router-dom"
import { useContext } from "react"
import { ourPlayerContext } from "./App"
import { useEffect } from "react"
import { useState } from "react"


function Room() {

    let ourPlayer = useContext(ourPlayerContext)
    let [username, setUsername] = useState(ourPlayer.username)

    useEffect(() => {
        if (username !== localStorage.getItem('username')) {
            setUsername(localStorage.getItem('username') as string) 
        }
        //console.log(localStorage)
    })

    const { id } = useParams()
    return (
        <>
        <div>You are in room {id}</div>
        {localStorage.getItem("username")}
        </>

    )
}

export default Room