import  { type Chat } from "@shared/types"
import styles from "../ChatSelect.module.css"
import { use, useEffect, useState } from "react"
import { SocketContext } from "@/Contexts/SocketContext"

type ChatPreviewProps = {
    data:Chat
    index:number
}

const ChatPreview = ({data, index}:ChatPreviewProps) => {
    const {setSelectedChat} = use(SocketContext)
    const [messagePreview, setMessagePreview] = useState<string>("")

    useEffect(() => {
        let newestMsg = "Start Chatting!"

        if(data.messages.length > 0) newestMsg = data.messages[data.messages.length - 1].body
        setMessagePreview(() => {
            return newestMsg.length < 20 ? newestMsg : newestMsg.slice(0, 20) + "..." 
        })
    }, [data])

    return(
        <div className={styles.previewContainer} onClick={() => setSelectedChat(index)}>
            <h2>{data.partner}</h2>
            <p>{messagePreview}</p>
        </div>
    )
}

export default ChatPreview