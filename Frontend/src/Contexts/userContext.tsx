import api from "@/util/api";

import { createContext, useState, type FC, type ReactNode } from "react";

type UserContextValue = {
    username:string,
    isLoggedIn:Boolean
    isValidUsername:any
    isValidPassword:any
    login: any
    logout:any
    signUp:any
    checkCredentials:any
}


export const UserContext = createContext<UserContextValue>({
    username:"",
    isLoggedIn:false,
    isValidUsername:"",
    isValidPassword:"",
    login: "",
    logout:"",
    signUp: "",
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
            const res = await api.post("/api/auth/login",{} , {withCredentials:true})
            if(res.status === 200){
                return true
            }
        }catch(err){
            console.log("Login error: " , err)
            return false
        }
    }

    const isValidUsername = async (username:string) => {
        const userRegex = /^[a-zA-Z0-9]{3,18}$/
        return username.match(userRegex) ? true : false;
    }

    const isValidPassword = (pass:string) => {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{3,}$/
        return pass.match(passRegex) ? true : false;
    }

    const login = async (username:string = "", password:string = "") => {
        try{
            const res = await api.post("/api/auth/login", {
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
        if(!isValidUsername(username) || !isValidPassword(password)){
            console.log("invalid user or pass")
            return
        }
        
        try{
            const res = await api.post("/api/auth/signup", {
                username:username,
                password:password,
            
            })
            return res
    
        }catch(err){
            console.log(err)
        }
    
    }
    
    const logout = () => {
        setIsLoggedIn(false)
        setUsername("")
    }


    const value = {
        username:username,
        isLoggedIn:isLoggedIn,
        isValidUsername:isValidUsername,
        isValidPassword:isValidPassword,
        login:login,
        logout:logout,
        signUp:signUp,
        checkCredentials:isValidJWT
    }

    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}