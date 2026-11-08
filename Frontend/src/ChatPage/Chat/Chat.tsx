import styles from "./Chat.module.css"
import type {  MessageType } from "../../../../shared/types"
import { use } from "react"
import { UserContext } from "../../Contexts/userContext"


type ChatProps = {
    chatData:MessageType
}

const Message:React.FC<ChatProps> = ({chatData}:ChatProps) => {
    const {userData} = use(UserContext)
    const isMyMessage = userData.id === chatData.sender_id
    const dynamicClasses = isMyMessage
        ? `green-outline-glow ${styles.myChat}`
        : "red-outline-glow"

    return(
        <div className={`${styles.chat}  ${dynamicClasses}`}>
            <p className={`${styles.chatBody}`}>
                {chatData.body}
            </p>
        </div>
    )
}

export default Message