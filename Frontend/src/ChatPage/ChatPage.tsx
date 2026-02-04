import { use, useState } from "react"
import styles from "./ChatPage.module.css"
import { UserContext } from "../Contexts/userContext"
import type { ChatData } from "@custom-types/types"
import { ChatArea } from "./Components/ChatArea"
import { SendMessageBtn } from "@/util/sendMessageBtn"

export const ChatPage = () => {
    const {username} = use(UserContext)
    const [othername, setOtherName] = useState<string>("other")
    


    const [chats, setChats] = useState<ChatData[]>([
    {
      to:username,
      from:othername,
      text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget quam eros. Nunc vitae nisl tellus. In hendrerit pretium lacinia. Integer ac conse"
    },
    {
      to:othername,
      from:username,
      text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget quam eros. Nunc vitae nisl tellus. In hendrerit pretium lacinia. Integer ac conse"
    },
    {
      to:othername,
      from:username,
      text:"Lorem ipsum dolor sit amet"
    },
    {
      to:username,
      from:othername,
      text:"Lorem ipsum dolor sit amet"
    },
    {
      to:username,
      from:othername,
      text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget quam eros. Nunc vitae nisl tellus. In hendrerit pretium lacinia. Integer ac conse"
    },
    {
      to:othername,
      from:username,
      text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget quam eros. Nunc vitae nisl tellus. In hendrerit pretium lacinia. Integer ac conse"
    },
    {
      to:othername,
      from:username,
      text:"Lorem ipsum dolor sit amet"
    },
  ])

    return(
        <div className={styles.mobileMain}>
          <SendMessageBtn/>
          <section className={styles.chatMain}>
            <h1 className={styles.chatHeader}>Chat Name</h1>
            <ChatArea chats={chats}/>
            <div className='chat-bar white-outline-glow'>
            </div>
          </section>
        </div>
    )
}