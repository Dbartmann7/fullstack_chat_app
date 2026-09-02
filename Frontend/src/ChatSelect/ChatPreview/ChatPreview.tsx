import  { type Chat } from "@shared/types"
import styles from "../ChatSelect.module.css"

type ChatPreviewProps = {
    data:Chat
}

const ChatPreview = ({data}:ChatPreviewProps) => {


    return(
        <div className={styles.previewContainer}>
            <h2>{data.partner}</h2>
            <p>{data.messages[data.messages.length-1]?.body || "Start Chatting!"}</p>
        </div>
    )
}

export default ChatPreview