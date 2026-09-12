import { type FC } from "react";
import styles from "./ChatArea.module.css"
import type {  MessageType } from "../../../../shared/types";

import Message from "../Chat";


type ChatAreaProps = {
   messages:MessageType[]
}
const ChatArea:FC<ChatAreaProps> = ({messages}:ChatAreaProps) => {
    return(
        <div className={styles.chatArea}>
            <ul>
                {messages.map((message) => {
                    return <Message chatData={message}/>
                })}
            </ul>
        </div>
    )
}

export default ChatArea