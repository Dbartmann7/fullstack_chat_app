import { use, useEffect, useState } from 'react'
import './App.css'

import {UserContext} from './Contexts/userContext'
import { ChatPage } from './ChatPage'
import { LoginPage } from './LoginPage'
import { SocketContext, SocketContextContainer } from './Contexts/SocketContext'


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
        {isLoggedIn ? 
            <SocketContextContainer>
              <ChatPage/> 
            </SocketContextContainer>
          : 
            <LoginPage/>
        }
      </div>

  )
}

export default App
