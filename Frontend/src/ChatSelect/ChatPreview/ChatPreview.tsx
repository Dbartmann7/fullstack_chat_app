import  { type Chat } from "@shared/types"
import styles from "../ChatSelect.module.css"
import { use } from "react"
import { SocketContext } from "@/Contexts/SocketContext"

type ChatPreviewProps = {
    data:Chat
    index:number
}

const ChatPreview = ({data, index}:ChatPreviewProps) => {
    const {selectChat} = use(SocketContext)

    return(
        <div className={styles.previewContainer} onClick={() => selectChat(index)}>
            <h2>{data.partner}</h2>
            <p>{data.messages[data.messages.length-1]?.body || "Start Chatting!"}</p>
        </div>
    )
}

export default ChatPreview