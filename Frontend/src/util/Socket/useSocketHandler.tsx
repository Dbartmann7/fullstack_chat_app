import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { StatusCodes } from "http-status-codes";
import type { SocketRes } from "../../../../custom-types/types";
// update url for production build with env
const URL:string = 'http://localhost:3000';
const socket:SocketIOClient.Socket = io(URL, {
  withCredentials: true
})
// TODO : put socket into state
export const useSocketHandler = () => {
    // const socketRef:React.RefObject<SocketIOClient.Socket> = useRef(socket)
    const [isConnected, setIsConnected] = useState<Boolean>(socket.connected)
    
    const sendMessage = (message:string): string => {
        
        socket.emit("sendMessage", message, (res:SocketRes) => {
            
            if(res.status !== StatusCodes.OK){
                console.log(res.error)
            }else{
                console.log("message sent!")
            }
        })
       
        return ""
    }
    
    const handleConnect = () => {
        setIsConnected(true)
        console.log("Socket connected to server")
    }
    const handleDisconnect = () => {
        setIsConnected(false)
        console.log("Socket disconnected from server")
    }
    const handleConnectionError = () => {
        console.log("Socket failed to connect to server")
    }
    const handleReconnectAttempt = () => {
        console.log("Socket Reconnecting...")
    }
    useEffect(() => {
       
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connection_error", handleConnectionError);
        socket.on("reconnect_attempt", handleReconnectAttempt);
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connection_error", handleConnectionError);
            socket.off("reconnect_attempt", handleReconnectAttempt);
        }
    }, []) 
    
    return {
        isConnected,
        sendMessage
    }
}