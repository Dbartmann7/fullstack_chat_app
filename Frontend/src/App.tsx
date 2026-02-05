import { useState, use } from 'react'
import './App.css'
import { useMediaQuery } from 'usehooks-ts'
import {UserContext} from './Contexts/userContext'
import { ChatPage } from './ChatPage'
import { LoginPage } from './LoginPage'


function App() {
  const {isLoggedIn} = use(UserContext)

  const charLimit:number = 300
  const [inputChat, setInputChat] = useState<string>("")


  return (

      <div className='app'>
        {isLoggedIn ? <ChatPage/> : <LoginPage/>}
        {/* <ChatPage/> */}
        {/* <LoginPage/> */}
      </div>

  )
}

export default App
