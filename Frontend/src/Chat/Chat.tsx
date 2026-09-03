import styles from "./Chat.module.css"
import type { ChatData, Message } from "../../../shared/types"
import { use, useEffect, useState } from "react"
import { UserContext } from "../Contexts/userContext"


type ChatProps = {
    chatData:Message
}

const Chat:React.FC<ChatProps> = ({chatData}:ChatProps) => {
    const [outlineStyle, setOutlineStyle] = useState<string>("")
    const {username} = use(UserContext)
    
    // const [dynamicClasses, setDynamicClasses]= useState<string>(`
    //     ${username === chatData.to ? `green-outline-glow ${styles.myChat}` : `red-outline-glow`}    
    // `)

    const [dynamicClasses, setDynamicClasses]= useState<string>('')
    useEffect(() => {
        // console.log(username)
        // console.log(chatData.to)
        // username === chatData.to ? setOutlineStyle('green-outline-glow') : setOutlineStyle('red-outline-glow')
    }, [])
    return(
        <div className={`${styles.chat}  ${dynamicClasses}`}>
            {chatData.body}
        </div>
    )
}

export default Chat