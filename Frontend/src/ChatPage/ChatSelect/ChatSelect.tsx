import { ChatContext } from "@/Contexts/ChatContext"
import { use, useEffect, useState, type Dispatch, type SetStateAction } from "react"
import ChatPreview from "../ChatPreview"

import styles from "./ChatSelect.module.css"
import LogOutBtn from "../LogOutBtn"
import Button from "@/util/Components/Button"
import { UserPlus, MessagesCircle, type LucideIcon } from "lucide-react"
import FindUserPage from "../FindUserPage"

type FindUserToggleBtnProps = {
    toggleVal:boolean
    toggleFn:Dispatch<SetStateAction<boolean>>
}

const FindUserToggleBtn = ({toggleVal, toggleFn}:FindUserToggleBtnProps) => {
    const [Icon, setIcon] = useState<LucideIcon>()

    const handleClick = () => {
        toggleFn((prev) => {
            return !prev
        })
    }

    useEffect(() => {
        setIcon(() => {
            return toggleVal ?  MessagesCircle:UserPlus 
        })
    }, [toggleVal])

    return (
        <Button onClick={handleClick} Logo={Icon}/>
    )

}

type ChatSelectProps = {

}

const ChatSelect = ({}:ChatSelectProps) => {
    const {chats} = use(ChatContext)    
    
    const [showUserSearch, setShowUserSearch] = useState<boolean>(false) 
    
    return (
        <>
        <div className={styles.container}>
        {
            showUserSearch ? 
                <FindUserPage/>
            :
                Array.from(chats.values()).map((chat, i) => {
                    return <ChatPreview data={chat} index={chat.id} key={i}/>
                })
            
        }
        </div>
        <FindUserToggleBtn toggleVal={showUserSearch} toggleFn={setShowUserSearch} />
        <LogOutBtn/>
        </>
    )
}

export default ChatSelect