

import api from "@/util/api";
import { type Chat } from "@shared/types";
import { createContext, use, useCallback, useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import { UserContext } from "./userContext";

type SocketContextValue = {
    isConnected:boolean,
    createSocket:() => void,
    destroySocket:() => void,
    sendMessage: (body:string) => boolean,
    chats:Chat[]
    selectedChat:Chat | null
    selectChat:(index:number) => void
}


export const SocketContext = createContext<SocketContextValue>({
    isConnected: false,
    createSocket: (): void => {
        throw new Error("Function not implemented.");
    },
    destroySocket: (): void => {
        throw new Error("Function not implemented.");
    },
    sendMessage: (body: string): boolean => {
        throw new Error("Function not implemented.");
    },
    chats: [],
    selectedChat: null,
    selectChat: function (index: number): void {
        throw new Error("Function not implemented.");
    }
})

type ContextProps = {
    children:ReactNode
}

export const SocketContextContainer:FC<ContextProps> = ({children}:ContextProps) => {
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

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
            socket.on("newMessage", (req) => {
                console.log(req)
                setChats((prevChats) => {
                    let newChats = [...prevChats]
                    return newChats.map((chat) => {
                        console.log(chat)
                        if(chat.id !== req.chat_id){
                            return chat
                        }
                        return {
                            ...chat,
                            messages:[
                                ...chat.messages,
                                req
                            ]
                        }
                    })
                }) 
                setSelectedChat((prev) => {
                    if(!prev) return null
                    if(prev.id !== req.chat_id){
                        return prev
                    }
                    return {
                        ...prev,
                        messages:[
                            ...prev.messages,
                            req
                        ]
                    }
                })
                
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

    const selectChat = (index:number) => {
        index < 0 ? setSelectedChat(null) : setSelectedChat(chats[index])
    }

    const sendMessage = (body:string ): boolean => {
        if(!socketRef.current){
            throw Error("Socket does not exist")
        }
        if(!selectedChat){
            throw Error("No chat selected, message cannot be sent")
        }
        socketRef.current.emit("sendMessage", {chat_id:selectedChat.id, sender_id:userData.id, body:body, createdAt:Date.now()}, (res:any) => {
     
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
                setChats(chatRes.data.body)
            }catch(err){
                console.log(err)
            }
        }
        
        fetchChats()
        return () => {
            destroySocket()
        }       
    }, []) 

    useEffect(() => {
        console.log(selectedChat)
    }, [selectedChat])
    const value = {
        
        isConnected:isConnected,
        createSocket:createSocket,
        destroySocket:destroySocket,
        sendMessage:sendMessage,
        chats:chats,     
        selectedChat:selectedChat,
        selectChat:selectChat   
    }

    return(
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}