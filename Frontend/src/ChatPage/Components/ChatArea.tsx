import type { FC } from "react";
import styles from "./ChatArea.module.css"
import type { ChatData } from "../../../../shared/types";
import Chat from "../../Chat";

type ChatAreaProps = {
    chats:ChatData[]
}
export const ChatArea:FC<ChatAreaProps> = ({chats}:ChatAreaProps) => {

    return(
        <div className={styles.chatArea}>
            <ul>
                {chats.map((chat) => {
                    return <Chat chatData={chat}/>
                })}
            </ul>
        </div>
    )
}