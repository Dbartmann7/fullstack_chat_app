import api from "@/util/api";
import { isAxiosError }  from "axios";


import { createContext, useEffect, useState, type FC, type ReactNode } from "react";

type UserContextValue = {
    username:string,
    isLoggedIn:Boolean
    isValidUsername:any
    isValidPassword:any
    login: any
    logout:any
    signUp:any
    checkCredentials:any
    authLoading:boolean
}


export const UserContext = createContext<UserContextValue>({
    username:"",
    isLoggedIn:false,
    isValidUsername:"",
    isValidPassword:"",
    login: "",
    logout:"",
    signUp: "",
    checkCredentials:"",
    authLoading:true
})

type ContextProps = {
    children:ReactNode
}

export const UserContextContainer:FC<ContextProps> = ({children}:ContextProps) => {
    const [username, setUsername] = useState<string>("")
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [authLoading, setAuthLoading] = useState<boolean>(true)
    const checkCredentials = async () => {
        try{
            const res = await api.get("/api/auth/me", {withCredentials:true})
            if(res.status === 200){
                setUsername(res.data.userData.username)
                setIsLoggedIn(true)
                return true
            }
            return false
        }catch(err){
            console.log("Login error: " , err)
            return false
        }finally{
            setAuthLoading(false)
        }
    }

    const isValidUsername = (username:string) => {
        const userRegex = /^[a-zA-Z0-9]{3,18}$/
        return username.match(userRegex) ? true : false;
    }

    const isValidPassword = (pass:string) => {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{8,}$/
        return pass.match(passRegex) ? true : false;
    }

    const login = async (username:string = "", password:string = "") => {
        try{
            const res = await api.post("/api/auth/login", {
                username:username,
                password:password,
            
            }, {withCredentials:true})
            console.log(res)
            if(res.status === 200){
                setIsLoggedIn(true)
                setUsername(username)
            }
            return {
                ok:true,
                message:res.data.message
            }
        }catch(err){
            setIsLoggedIn(false)
            setUsername("")
            let message = ""

            isAxiosError(err) ? message = err.response?.data.message : "Something unexpected went wrong"
            return{
                ok:false,
                error:message
            }
        }
    }

    const signUp = async (username:string, password:string) => {
        console.log(username)
        if(!isValidUsername(username)){
            return {
                ok:false,
                error:"Username must be 3-18 characters long and must not contain special characters"
            }
        }
        console.log(password)
        if(!isValidPassword(password)){
            return{
                ok:false,
                error:"Password must be at least 8 chars long and have at least 1 uppercase letter, 1 lowercase letter, and 1 number"
            }
        }
        
        try{
            const res = await api.post("/api/auth/signup", {
                username:username,
                password:password,
            
            })
            return {
                ok:true,
                message:res.data.message
            }
    
        }catch(err){
            let message = ""
            isAxiosError(err) ? message = err.response?.data.message : "Something unexpected went wrong"
            return{
                ok:false,
                error:message
            }
        }
    
    }
    
    const logout = async () => {
        await api.post("/api/auth/logout", {}, {
            withCredentials:true
        })
        setIsLoggedIn(false)
        setUsername("")
    }

    useEffect(() => {
        checkCredentials()
    }, [])


    const value = {
        username:username,
        isLoggedIn:isLoggedIn,
        isValidUsername:isValidUsername,
        isValidPassword:isValidPassword,
        login:login,
        logout:logout,
        signUp:signUp,
        checkCredentials:checkCredentials,
        authLoading:authLoading
    }

    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}