import styles from "./Chat.module.css"
import type { ChatData, MessageType } from "../../../../shared/types"
import { use, useEffect, useState } from "react"
import { UserContext } from "../../Contexts/userContext"


type ChatProps = {
    chatData:MessageType
}

const Message:React.FC<ChatProps> = ({chatData}:ChatProps) => {
    const [outlineStyle, setOutlineStyle] = useState<string>("")
    const {userData} = use(UserContext)
    
    const [dynamicClasses, setDynamicClasses]= useState<string>(`
        ${userData.id === chatData.sender_id ? `green-outline-glow ${styles.myChat}` : `red-outline-glow`}    
    `)
    // useEffect(() => {
    //     userData.id === chatData.sender_id ? setOutlineStyle('green-outline-glow') : setOutlineStyle('red-outline-glow')
    // }, [])
    return(
        <div className={`${styles.chat}  ${dynamicClasses}`}>
            <p className={`${styles.chatBody}`}>
                {chatData.body}
            </p>
        </div>
    )
}

export default Message