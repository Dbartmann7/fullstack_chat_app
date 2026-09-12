

import { SocketContext } from "@/Contexts/SocketContext"
import { use } from "react"
import ChatArea from "../ChatArea"

import styles from "../ChatPage.module.css"
import { InputBar } from "../ChatInputBar"
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