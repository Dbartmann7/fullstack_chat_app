

import type { ChatData, SocketRes } from "@shared/types";
import { StatusCodes } from "http-status-codes";
import { createContext, useCallback, useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

type SocketContextValue = {
    isConnected:boolean,
    createSocket:() => void,
    destroySocket:() => void,
    sendMessage: (from:string, to:string, text:string) => boolean,
    messages:ChatData[] | null
}


export const SocketContext = createContext<SocketContextValue>({
    isConnected: false,
    createSocket: (): void => {
        throw new Error("Function not implemented.");
    },
    destroySocket: (): void => {
        throw new Error("Function not implemented.");
    },
    sendMessage:(from:string, to:string, text:string): boolean => {
        throw new Error("Function not implemented.");
    },
    messages:[]
})

type ContextProps = {
    children:ReactNode
}

export const SocketContextContainer:FC<ContextProps> = ({children}:ContextProps) => {
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [messages, setMessages] = useState<ChatData[] | null>(null)

    // update url for production build with env
    const URL:string = 'http://localhost:3000';
    
    const handleConnect = useCallback(() => {
        setIsConnected(true)
        console.log("Socket connected to server")
    }, [])
    
    const handleDisconnect = useCallback(() => {
        setIsConnected(false)
        console.log("Socket disconnected from server")
    }, [])

    const handleReconnect = useCallback(() => {
        console.log("reconnected")
    }, [])
    const createSocket = () => {
        if(socketRef.current){
            console.log("Socket already exists")
        }else{
            const socket = io(URL, {
                withCredentials:true,
                reconnection:true,
                reconnectionAttempts:5,
                reconnectionDelay:1000,
                reconnectionDelayMax:5000
            });
            
            socket.on("connect", handleConnect);
            socket.on("disconnect", handleDisconnect);
            socket.io.on("reconnect", handleReconnect)
            socket.on("fetchChats", (req:any) => {
                console.log(req.body)
                setMessages(req.body)
            })
            socketRef.current = socket
        }
    }
        
    const destroySocket = () => {
        const socket = socketRef.current
        if(!socket) {
            console.log("No socket to destroy")
        }else{
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.io.off("reconnect", handleReconnect)
            socket.disconnect()
            socketRef.current = null
        }
        
    }

    const sendMessage = (from:string, to:string, text:string): boolean => {
        if(!socketRef.current){
            throw Error("Socket does not exist")
        }
        console.log(from, to, text)
        socketRef.current.emit("sendMessage", {from:from,to:to, text:text}, (res:any) => {
     
            return res.ok
        })
        return false
    }
    
    
    useEffect(() => {
        return () => {
            destroySocket()
        }       
    }, []) 


    const value = {
        
        isConnected:isConnected,
        createSocket:createSocket,
        destroySocket:destroySocket,
        sendMessage:sendMessage,
        messages:messages
        
    }

    return(
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}