import { useEffect, useState, useRef, use } from 'react'
import './App.css'
import { useMediaQuery } from 'usehooks-ts'
import { useSocketHandler } from './util/Socket/useSocketHandler'
import type { ChatData} from '../../custom-types/types'
import Chat from './Chat'
import {UserContext, UserContextContainer } from './Contexts/userContext'
import { ChatPage } from './ChatPage'
import { LoginPage } from './LoginPage'


function App() {
  const {username, isLoggedIn} = use(UserContext)
  const [othername, setOtherName] = useState<string>("other")
  

  const charLimit:number = 300
  const [inputChat, setInputChat] = useState<string>("")
  const {isConnected, sendMessage} = useSocketHandler()

  const isSmallScreen = useMediaQuery('(max-width:800px)')
  
  const handleInput = (e:React.FormEvent<HTMLDivElement>) => {
    let text:string = e.currentTarget.textContent 

    // if new text is too long, reset text content to last text without updating state
    if(text.length > charLimit){
      e.currentTarget.textContent = inputChat
      return
    }
    setInputChat(text)
  }


  useEffect(() => {
    console.log(isLoggedIn)
  }, [isLoggedIn])
  useEffect(() => {
    if(isConnected){
      sendMessage("hello")
    }
  }, [isConnected])


  return (

      <div className='app'>
        {isLoggedIn ? <ChatPage/> : <LoginPage/>}
        {/* <ChatPage/> */}
        {/* <LoginPage/> */}
      </div>

  )
}

export default App
