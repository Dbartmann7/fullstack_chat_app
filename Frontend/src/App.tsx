import { use, } from 'react'
import './App.css'

import {UserContext} from './Contexts/userContext'
import { ChatPage } from './ChatPage'
import { LoginPage } from './LoginPage'
import { SocketContextContainer } from './Contexts/SocketContext'


function App() {
  const {isLoggedIn, authLoading} = use(UserContext)

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
