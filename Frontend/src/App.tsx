import { use, } from 'react'
import './App.css'

import {UserContext} from './Contexts/userContext'
import { LoginPage } from './LoginPage'

import { ChatPage } from './ChatPage'
import { ChatContextContainer } from './Contexts/ChatContext'

function App() {
  const {isLoggedIn, authLoading} = use(UserContext)

  if(authLoading){
    return <h1></h1>
  }

  return (

      <div className='app'>
        {isLoggedIn ? 
            <ChatContextContainer>
              <ChatPage/>
            </ChatContextContainer>
          : 
            <LoginPage/>
        }
      </div>

  )
}

export default App
