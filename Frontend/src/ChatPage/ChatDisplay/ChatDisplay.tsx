

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
    const {selectChat, selectedChat} = use(SocketContext)
    

    if(!selectedChat){
        return "no chat selected"
    }

    return (
        <div className={styles.chatMain}>
            <div style={{"display":"flex", "justifyContent":"space-between"}}>
                <button className={styles.backBtn} onClick={() => selectChat(-1)}>
                    <ArrowLeftToLine className={styles.backIcon} />
                </button>
                <h1 className={styles.chatHeader}>{selectedChat.partner}</h1>                
            </div>
            
            <ChatArea/>
            < InputBar/>
            
        </div> 
    )
}


export default ChatDisplay