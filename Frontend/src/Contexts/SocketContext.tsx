

import api from "@/util/api";
import { type Chat, type Message } from "@shared/types";
import { createContext, use, useCallback, useEffect, useRef, useState, type FC, type ReactNode, type SetStateAction } from "react";
import { io, type Socket } from "socket.io-client";
import { UserContext } from "./userContext";

type SocketContextValue = {
    isConnected:boolean,
    sendMessage: (body:string) => boolean,
    chats:Map<number, Chat>
    selectedChat:number
    setSelectedChat:React.Dispatch<React.SetStateAction<number>>
    currentChat:Chat
}


export const SocketContext = createContext<SocketContextValue>({
    isConnected: false,
    sendMessage: (body: string): boolean => {
        throw new Error("Function not implemented.");
    },
    chats: new Map<number, Chat>(),
    selectedChat: -1,
    setSelectedChat: function (value: SetStateAction<number>): void {
        throw new Error("Function not implemented.");
    },
    currentChat: {
        id: 0,
        partner_id: 0,
        partner: "",
        messages: []
    }
})

type ContextProps = {
    children:ReactNode
}

export const SocketContextContainer:FC<ContextProps> = ({children}:ContextProps) => {
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [chats, setChats] = useState<Map<number, Chat>>(new Map<number, Chat>())
    const [selectedChat, setSelectedChat] = useState<number>(-1)
    const [currentChat, setCurrentChat] = useState<Chat>({
        id: -1,
        partner_id: 0,
        partner: "",
        messages: []
    })

    const {userData} = use(UserContext)
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

    const handleNewMessage = useCallback((newMessage:Message) => {
        console.log(newMessage)
        setChats((prevChats) => {
            let newChats:Map<number, Chat> = new Map(JSON.parse(JSON.stringify([...prevChats])))
            let targetChat = newChats.get(newMessage.chat_id)
            if(!targetChat) return prevChats
                targetChat.messages.push(newMessage)
                newChats.set(newMessage.chat_id, targetChat)
                return newChats
            }) 
    }, [])
    const createSocket = () => {
        if(socketRef.current){
            console.log("Socket already exists")
        }else{
            console.log("creating socket...")
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
            socket.on("newMessage", handleNewMessage)
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
            socket.off("newMessage", handleNewMessage)
            socket.disconnect()
            socketRef.current = null
        }
        
    }

    const sendMessage = (body:string ): boolean => {
        if(!socketRef.current){
            throw Error("Socket does not exist")
        }
        if(selectedChat < 0){
            throw Error("No chat selected, message cannot be sent")
        }
        socketRef.current.emit("sendMessage", {chat_id:selectedChat, sender_id:userData.id, body:body, createdAt:Date.now()}, (res:any) => {
     
            return res.ok
        })
        return false
    }
    
    
    useEffect(() => {
        const fetchChats = async () => {
            try{
                const chatRes = await api.get("api/chat", {
                    withCredentials:true
                })
                // setChats(chatRes.data.body)
                setChats((prev) => {
                    let newChats = new Map(prev)
                    let body = chatRes.data.body
                    console.log(body)
                    for(let i=0; i<body.length; i++){
                        newChats.set(body[i].id, body[i])
                    }
                    return newChats
                })
            }catch(err){
                console.log(err)
            }
        }
        createSocket()
        fetchChats()
        return () => {
           destroySocket()
        }       
    }, []) 

    useEffect(() => {
        let targetChat = chats.get(selectedChat)
        if(targetChat){
            setCurrentChat(targetChat)
        }
    }, [selectedChat, chats])
    // useEffect(() => {
    //     console.log(chats)
    // }, [chats])
    const value = {
        
        isConnected:isConnected,
        sendMessage:sendMessage,
        chats:chats,     
        selectedChat:selectedChat,
        setSelectedChat:setSelectedChat,
        currentChat:currentChat
    }

    return(
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}