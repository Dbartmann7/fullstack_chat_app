import { use, type FC } from "react";
import styles from "./ChatArea.module.css"
import type { ChatData, Message } from "../../../../shared/types";
import Chat from "../../Chat";
import { SocketContext } from "@/Contexts/SocketContext";

type ChatAreaProps = {
   messages:Message[]
}
export const ChatArea:FC<ChatAreaProps> = ({messages}:ChatAreaProps) => {
    const {selectedChat} = use(SocketContext)   

    return(
        <div className={styles.chatArea}>
            <ul>
                {messages.map((message) => {
                    return <Chat chatData={message}/>
                })}
            </ul>
        </div>
    )
}