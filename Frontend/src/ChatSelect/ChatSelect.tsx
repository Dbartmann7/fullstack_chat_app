import { SocketContext } from "@/Contexts/SocketContext"
import { use, useEffect } from "react"
import ChatPreview from "./ChatPreview"

import styles from "./ChatSelect.module.css"

const ChatSelect = () => {
    const {createSocket, chats} = use(SocketContext)    
    
    useEffect(() => {
        createSocket()
    }, [])
    useEffect(() => {
        console.log(chats)
    }, [chats])
    return (
        <div className={styles.container}>
        {
            chats.map((chat, i) => {
                return <ChatPreview data={chat}/>
            })
        }
        </div>
    )
}

export default ChatSelect