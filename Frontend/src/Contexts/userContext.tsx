import api from "@/util/api";

import { createContext, useEffect, useState, type FC, type ReactNode } from "react";

type UserContextValue = {
    username:string,
    isLoggedIn:Boolean
    login: any
    checkCredentials:any
}


export const UserContext = createContext<UserContextValue>({
    username:"",
    isLoggedIn:false,
    login: "",
    checkCredentials:""
})

type ContextProps = {
    children:ReactNode
}

export const UserContextContainer:FC<ContextProps> = ({children}:ContextProps) => {
    const [username, setUsername] = useState<string>("")
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    
    const checkJWT = async () => {
        try{
            const res = await api.post("/login",{} , {withCredentials:true})
            if(res.status === 200){
                setIsLoggedIn(true)
                setUsername(res.data.userData.username)
            }
        }catch(err){
            console.log("Login error: " , err)
            setIsLoggedIn(false)
            setUsername("")
        }
    }

    useEffect(() => {
        checkJWT()
    }, [])
    
    const login = async (username:string, password:string) => {
        try{
            
            const res = await api.post("/login", {
                username:username,
                password:password,
            
            }, {withCredentials:true})
            if(res.status === 200){
                setIsLoggedIn(true)
                setUsername(username)
            }
            return res
        }catch(err){
            console.log(err)
            setIsLoggedIn(false)
            setUsername("")
            return err
        }
        

    }
    
    const value = {
        username:username,
        isLoggedIn:isLoggedIn,
        login:login,
        checkCredentials:checkJWT
    }

    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}