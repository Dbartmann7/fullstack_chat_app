import { use, useEffect, useState } from "react"
import styles from "./ChatPage.module.css"
import { UserContext } from "../Contexts/userContext"
import type { Chat, ChatData } from "@shared/types"
import { ChatArea } from "./Components/ChatArea"
import { SocketContext } from "@/Contexts/SocketContext"
import { InputBar } from "./Components/ChatInputBar"
import ChatPreview from "@/ChatSelect/ChatPreview"
import ChatSelect from "@/ChatSelect/ChatSelect"
import ChatDisplay from "./ChatDisplay/ChatDisplay"


export const ChatPage = () => {
  const {username, checkCredentials, logout} = use(UserContext);
  const {isConnected, createSocket, destroySocket,chats, messages} = use(SocketContext);
  const [selectedChat, setSelectedChat] = useState<number>(-1)


  useEffect(() => {
    createSocket()

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



  const selectChat = (index:number) => {
    setSelectedChat(index)
  }

  return(
      <main className={styles.mobileMain}>
        
        <div className={styles.chatMain}>
          { 
          selectedChat < 0 ?
            <ChatSelect onClick={selectChat}/>
            :
            
            <ChatDisplay selectedChat={selectedChat} selectChat={selectChat}/>
          }
          
        </div>
      </main>
  )
}