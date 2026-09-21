import { SocketContext } from "@/Contexts/SocketContext"
import { use } from "react"
import ChatPreview from "../ChatPreview"

import styles from "./ChatSelect.module.css"
import LogOutBtn from "../LogOutBtn"
import FindUserBtn from "@/FindUserBtn"

type ChatSelectProps = {

}

const ChatSelect = ({}:ChatSelectProps) => {
    const {chats} = use(SocketContext)    
    
    return (
        <>
        <div className={styles.container}>
        {
            Array.from(chats.values()).map((chat, i) => {
                return <ChatPreview data={chat} index={chat.id} key={i}/>
            })  
        }
        </div>
        <FindUserBtn/>
        <LogOutBtn/>
        </>
    )
}

export default ChatSelect