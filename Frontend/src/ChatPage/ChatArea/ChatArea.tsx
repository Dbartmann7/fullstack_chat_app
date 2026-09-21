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
                {messages.map((message, i) => {
                    return <Message chatData={message} key={i}/>
                })}
            </ul>
        </div>
    )
}

export default ChatArea