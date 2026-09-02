import { SocketContext } from "@/Contexts/SocketContext"
import { use, useEffect } from "react"

const ChatSelect = () => {
    const {createSocket, chats} = use(SocketContext)    
    
    useEffect(() => {
        createSocket()
    }, [])
    useEffect(() => {
        console.log(chats)
    }, [chats])
    return (
        <>
        {
            chats.map((chat, i) => {
                return <div>{chat.partner}</div>
            })
        }
        </>
    )
}

export default ChatSelect