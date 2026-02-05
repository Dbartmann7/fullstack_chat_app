import { use, useEffect, useState } from "react"
import styles from "./ChatPage.module.css"
import { UserContext } from "../Contexts/userContext"
import type { ChatData } from "@custom-types/types"
import { ChatArea } from "./Components/ChatArea"
import { useSocketHandler } from "@/util/Socket/useSocketHandler"
import { InputBar } from "./Components/ChatInputBar"

export const ChatPage = () => {
    const {username, checkCredentials} = use(UserContext);
    const {isConnected, createSocket, destroySocket, sendMessage} = useSocketHandler();
    const [othername, setOtherName] = useState<string>("other");

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

  const [input, setInput] = useState<string>("");

  useEffect(() => {
    createSocket()

    return () => {
        destroySocket()
    }

  }, [])

  useEffect(() => {
    if(!isConnected){
      checkCredentials()
    }
  }, [isConnected])

  useEffect(() => {
    console.log(input)
  }, [input])

  return(
      <div className={styles.mobileMain}>
        <section className={styles.chatMain}>
          <h1 className={styles.chatHeader}>Chat Name</h1>
          <ChatArea chats={chats}/>
          <InputBar value={input} setValue={setInput}/>
        </section>
      </div>
  )
}