import { useState, use, useEffect } from 'react'
import './App.css'
import { useMediaQuery } from 'usehooks-ts'
import {UserContext} from './Contexts/userContext'
import { ChatPage } from './ChatPage'
import { LoginPage } from './LoginPage'


function App() {
  const {isLoggedIn, login} = use(UserContext)

  useEffect(() => {
    login()
  }, [])
  return (

      <div className='app'>
        {isLoggedIn ? <ChatPage/> : <LoginPage/>}
        {/* <ChatPage/> */}
        {/* <LoginPage/> */}
      </div>

  )
}

export default App
