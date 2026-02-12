import api from "@/util/api";

import { createContext, useEffect, useState, type FC, type ReactNode } from "react";

type UserContextValue = {
    username:string,
    isLoggedIn:Boolean
    login: any
    logout:any
    checkCredentials:any
}


export const UserContext = createContext<UserContextValue>({
    username:"",
    isLoggedIn:false,
    login: "",
    logout:"",
    checkCredentials:""
})

type ContextProps = {
    children:ReactNode
}

export const UserContextContainer:FC<ContextProps> = ({children}:ContextProps) => {
    const [username, setUsername] = useState<string>("")
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    
    const isValidJWT = async () => {
        try{
            const res = await api.post("/login",{} , {withCredentials:true})
            if(res.status === 200){
                return true
            }
        }catch(err){
            console.log("Login error: " , err)
            return false
        }
    }
    
    const login = async (username:string = "", password:string = "") => {
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

    const signUp = async (username:string, password:string) => {
        try{
            const res = await api.post("/signup", {
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
    
    const logout = () => {
        setIsLoggedIn(false)
        setUsername("")
    }


    const value = {
        username:username,
        isLoggedIn:isLoggedIn,
        login:login,
        logout:logout,
        checkCredentials:isValidJWT
    }

    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}