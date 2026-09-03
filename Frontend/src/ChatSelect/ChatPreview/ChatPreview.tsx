import  { type Chat } from "@shared/types"
import styles from "../ChatSelect.module.css"

type ChatPreviewProps = {
    data:Chat
    index:number
    onClick: (key:number) => void
}

const ChatPreview = ({data, index, onClick}:ChatPreviewProps) => {
    

    return(
        <div className={styles.previewContainer} onClick={() => onClick(index)}>
            <h2>{data.partner}</h2>
            <p>{data.messages[data.messages.length-1]?.body || "Start Chatting!"}</p>
        </div>
    )
}

export default ChatPreview