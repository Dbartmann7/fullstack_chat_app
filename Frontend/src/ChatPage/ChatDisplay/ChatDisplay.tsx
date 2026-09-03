import { SocketContext } from "@/Contexts/SocketContext"
import { type Chat } from "@shared/types"
import { use, useEffect, useState } from "react"
import { ChatArea } from "../Components/ChatArea"

import styles from "../ChatPage.module.css"
import { InputBar } from "../Components/ChatInputBar"

type ChatDisplayProps = {
    selectedChat:number,
    selectChat:(index:number) => void
}


const ChatDisplay = ({selectedChat, selectChat}:ChatDisplayProps) => {
    const {chats} = use(SocketContext)
    const [chatData, setChatData] = useState<Chat>()

    useEffect(() => {
        setChatData(chats[selectedChat])
    }, [selectedChat])
     
    if(!chatData){
        return "no chat selected"
    }

    return (
        <div>
            <button onClick={() => selectChat(-1)}>back</button>
            <h1 className={styles.chatHeader}>{chatData.partner}</h1>
            <ChatArea selectedChat={selectedChat}/>
            < InputBar/>
            
        </div> 
    )
}


export default ChatDisplay