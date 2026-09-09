import { use, type FC } from "react";
import styles from "./ChatArea.module.css"
import type { ChatData } from "../../../../shared/types";
import Chat from "../../Chat";
import { SocketContext } from "@/Contexts/SocketContext";

type ChatAreaProps = {
   
}
export const ChatArea:FC<ChatAreaProps> = ({}:ChatAreaProps) => {
    const {selectedChat} = use(SocketContext)   

    return(
        <div className={styles.chatArea}>
            <ul>
                {selectedChat!.messages.map((message) => {
                    return <Chat chatData={message}/>
                })}
            </ul>
        </div>
    )
}