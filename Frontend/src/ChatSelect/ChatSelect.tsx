import { SocketContext } from "@/Contexts/SocketContext"
import { use, useEffect, useState } from "react"
import ChatPreview from "./ChatPreview"

import styles from "./ChatSelect.module.css"

type ChatSelectProps = {

}

const ChatSelect = ({}:ChatSelectProps) => {
    const {chats} = use(SocketContext)    
    
    return (
        <div className={styles.container}>
        {
            Array.from(chats.values()).map((chat, i) => {
                return <ChatPreview data={chat} index={chat.id} key={i}/>
            })  
        }
        </div>
    )
}

export default ChatSelect