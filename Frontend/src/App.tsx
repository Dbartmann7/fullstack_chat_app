import { use, useEffect, useState } from 'react'
import './App.css'

import {UserContext} from './Contexts/userContext'
import { ChatPage } from './ChatPage'
import { LoginPage } from './LoginPage'
import { SocketContext, SocketContextContainer } from './Contexts/SocketContext'


function App() {
  const {isLoggedIn, checkCredentials, authLoading} = use(UserContext)


  // useEffect(() => {
  //   const attemptJWTLogin = async () => {
  //     await checkCredentials()
  //     setAuthLoading(false)
  //   }
    
  //   attemptJWTLogin()
  // }, [])

  if(authLoading){
    return <h1></h1>
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
