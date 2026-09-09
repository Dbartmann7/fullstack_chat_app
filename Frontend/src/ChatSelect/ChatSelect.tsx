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
            chats.map((chat, i) => {
                return <ChatPreview data={chat} index={i}/>
            })  
        }
        </div>
    )
}

export default ChatSelect