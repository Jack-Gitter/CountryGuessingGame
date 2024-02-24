import { useParams } from "react-router-dom"
function Room() {

    const { id } = useParams()
    return (
        <div>You are in room {id}</div>

    )
}

export default Room