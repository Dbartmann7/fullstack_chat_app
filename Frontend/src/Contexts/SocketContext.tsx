

import type { SocketRes } from "@shared/types";
import { StatusCodes } from "http-status-codes";
import { createContext, useCallback, useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

type SocketContextValue = {
    isConnected:boolean,
    createSocket:() => void,
    destroySocket:() => void,
    sendMessage: (message:string) => void
}


export const SocketContext = createContext<SocketContextValue>({
    isConnected: false,
    createSocket: (): void => {
        throw new Error("Function not implemented.");
    },
    destroySocket: (): void => {
        throw new Error("Function not implemented.");
    },
    sendMessage:(message: string): void => {
        throw new Error("Function not implemented.");
    }
})

type ContextProps = {
    children:ReactNode
}

export const SocketContextContainer:FC<ContextProps> = ({children}:ContextProps) => {
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)

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

    const sendMessage = (message:string): void => {
        console.log(socketRef.current)
        if(!socketRef.current){
            throw Error("Socket does not exist")
        }
        
        socketRef.current.emit("sendMessage", message, (res:SocketRes) => {
            
            if(res.status !== StatusCodes.OK){
                console.log(res.error)
            }else{
                console.log("message sent!")
            }
        })
       
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
        sendMessage:sendMessage
        
    }

    return(
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}