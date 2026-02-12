import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { StatusCodes } from "http-status-codes";
import type { SocketRes } from "@custom-types/types";
import type { Socket } from "socket.io-client";
// update url for production build with env
const URL:string = 'http://localhost:3000';

export const useSocketHandler = () => {
    const socketRef = useRef<SocketIOClient.Socket | null>(null)
    const [isConnected, setIsConnected] = useState<Boolean>(false)

  
    
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
            socket.on("reconnect", handleReconnect)
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
            
            socket.disconnect()
            socketRef.current = null
        }
        
    }

    const sendMessage = (message:string): string => {
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
       
        return ""
    }
    
    
    useEffect(() => {
        return () => {
            destroySocket()
        }       
    }, []) 


    return {
        isConnected,
        createSocket,
        destroySocket,
        sendMessage
    }
}