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

    const handleConnectError = useCallback(() => {
        console.log("Socket failed to connect to server")
    },[])

    const handleReconnectAttempt = useCallback(() => {
        console.log("Socket Reconnecting...")
        
    },[])

    const createSocket = () => {
        if(socketRef.current){
            console.log("Socket already exists")
        }else{
            const socket = io(URL, {
                withCredentials:true
            });
            
            
            socket.on("connect", handleConnect);
            socket.on("disconnect", handleDisconnect);
            socket.on("connect_error", handleConnectError);
            socket.io.on("reconnect_attempt", handleReconnectAttempt);

            socketRef.current = socket
        }
    }
        
    const destroySocket = () => {
        const socket = socketRef.current
        console.log("dest")
        if(!socket) {
            console.log("No socket to destroy")
        }else{
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.io.off("reconnect_attempt", handleReconnectAttempt);
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