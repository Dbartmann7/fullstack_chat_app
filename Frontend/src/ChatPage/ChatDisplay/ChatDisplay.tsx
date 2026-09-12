

import { SocketContext } from "@/Contexts/SocketContext"
import { type Chat } from "@shared/types"
import { use, useEffect, useState } from "react"
import { ChatArea } from "../Components/ChatArea"

import styles from "../ChatPage.module.css"
import { InputBar } from "../Components/ChatInputBar"
import { ArrowLeftToLine } from "lucide-react"

type ChatDisplayProps = {

}


const ChatDisplay = ({ }:ChatDisplayProps) => {
    const {setSelectedChat, currentChat} = use(SocketContext)
  

    return (
        <div className={styles.chatMain}>
            <div style={{"display":"flex", "justifyContent":"space-between"}}>
                <button className={styles.backBtn} onClick={() => setSelectedChat(-1)}>
                    <ArrowLeftToLine className={styles.backIcon} />
                </button>
                <h1 className={styles.chatHeader}>{currentChat.partner}</h1>                
            </div>
            
            <ChatArea messages={currentChat.messages}/>
            < InputBar/>
            
        </div> 
    )
}


export default ChatDisplay