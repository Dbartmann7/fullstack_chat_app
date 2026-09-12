import { use, useEffect, useState } from "react"
import styles from "./ChatPage.module.css"
import { UserContext } from "../Contexts/userContext"
import { SocketContext } from "@/Contexts/SocketContext"
import ChatSelect from "./ChatSelect"
import ChatDisplay from "./ChatDisplay/ChatDisplay"


export const ChatPage = () => {
  const { checkCredentials, logout} = use(UserContext);
  const {isConnected, selectedChat} = use(SocketContext);
  

  // useEffect(() => {
  //   createSocket()

  // }, [])

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




  return(
      <main className={styles.mobileMain}>
        { 
          selectedChat < 0 ?
            <ChatSelect />
            :
            <ChatDisplay/>
        }
      </main>
  )
}