import { use, useEffect, useState } from 'react'
import './App.css'

import {UserContext} from './Contexts/userContext'
import { ChatPage } from './ChatPage'
import { LoginPage } from './LoginPage'


function App() {
  const {isLoggedIn, login} = use(UserContext)
  const [authLoading, setAuthLoading] = useState<boolean>(true)

  useEffect(() => {
    const attemptJWTLogin = async () => {
      await login()
      setAuthLoading(false)
    }
    
    attemptJWTLogin()
  }, [])

  if(authLoading){
    return <h1>Loading...</h1>
  }

  return (

      <div className='app'>
        {isLoggedIn ? <ChatPage/> : <LoginPage/>}
        {/* <ChatPage/> */}
        {/* <LoginPage/> */}
      </div>

  )
}

export default App
