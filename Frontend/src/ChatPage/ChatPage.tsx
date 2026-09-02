import { use, useEffect, useState } from "react"
import styles from "./ChatPage.module.css"
import { UserContext } from "../Contexts/userContext"
import type { Chat, ChatData } from "@shared/types"
import { ChatArea } from "./Components/ChatArea"
import { SocketContext } from "@/Contexts/SocketContext"
import { InputBar } from "./Components/ChatInputBar"

export const ChatPage = () => {
    const {username, checkCredentials, logout} = use(UserContext);
    const {isConnected, createSocket, destroySocket, messages} = use(SocketContext);
    const [othername, setOtherName] = useState<string>("other");

    const [messagesState, setMessages] = useState<Chat[]>([])


  

  useEffect(() => {
    createSocket()

    return () => {
        destroySocket()
    }

  }, [])

  useEffect(() => {

    const reconnect = async () => {
      const tokenStillValid = await checkCredentials();
  
      if(!tokenStillValid){
        logout();
      }
    }
    
    if(!isConnected){
      reconnect()
    }
  }, [isConnected])

  if(!messages) return <h1>Loading...</h1>

  return(
      <main className={styles.mobileMain}>
        <section className={styles.chatMain}>
          <h1 className={styles.chatHeader}>Chat Name</h1>
          <ChatArea chats={messages}/>
          <InputBar/>
        </section>
      </main>
  )
}