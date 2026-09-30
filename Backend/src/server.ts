import express from 'express'
import { createServer} from 'node:http'
import cors from "cors"
import * as cookie from "cookie"
import cookieParser from "cookie-parser"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { StatusCodes } from "http-status-codes";
import type { ChatData, jwtData, MessageType, SocketRes } from '@shared/types'
import dotenv from "dotenv"
import "dotenv/config";
import userRouter from './routes/userRoutes'
import { db } from './db'
import chatRouter from './routes/chatRoutes'
dotenv.config()

const JWT_KEY:string | undefined = process.env.JWT_KEY
if(!JWT_KEY) {
    throw new Error("NO JWT KEY, PLEASE SET A JWT KEY")
}

//  ************************* Functions *************************  \\


/** 
 * Verifies a given JWT token. Returns the data contained in the token if valid, returns null if not. 
 * @param {string | undefined} token - JWT token 
 */
const verifyJWT = (token:string | undefined): jwtData | null => {

    if(!token){
        return null
    }
    try{
        const tokenData = jwt.verify(token, JWT_KEY) as jwtData
        return tokenData
    }catch(err){
        return null
    }
}



//  ************************* Express *************************  \\
const PORT:number = 3000
const app = express()
app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
}))
app.use(express.json())
app.use(cookieParser())
const server = createServer(app)

app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)
app.get('/', (req, res) => {
    res.send("Server for Chat App")
})


const deleteStaleAccounts = async () => {
    try{
        let toBeDeleted:{id:number, chat_ids:number[]}[] = (await db.query(`SELECT u.id, 
            COALESCE(array_agg(cm.chat_id) FILTER (WHERE cm.chat_id IS NOT NULL), '{}') AS chat_ids 
            FROM users u 
            LEFT JOIN chat_members cm ON cm.user_id = u.id
            WHERE u.timeCreated < $1 AND u.istemporary = true
            GROUP BY u.id`, [Date.now() - 1000 * 60 * 60 * 24 * 100])
        ).rows
        console.log(toBeDeleted)
        if(toBeDeleted.length === 0) return
        for(const item of toBeDeleted){
           for(const chat_id of item.chat_ids){
                await db.query(`DELETE FROM chats WHERE id = $1`, [chat_id])
                // ON DELETE CASCADE rull means all other user info (chats, messages) are deleted
            }
           await db.query(`DELETE FROM users WHERE id = $1`, [item.id])
        }
            
    }catch(err){
        console.log(err)
    }
}
deleteStaleAccounts()
setInterval(async () => {
        deleteStaleAccounts()        
   }, 1000 * 60
)
//  ************************* Socket.io  *************************  \\

const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        credentials:true
    }
})

io.use((socket, next) => {
  
    const cookies = cookie.parse(socket.handshake.headers.cookie || "")
    const data:jwtData | null = verifyJWT(cookies.token)
    console.log(data)
    if(!data){
        next(new Error("Unauthorized"))
    }

    socket.data.user = data
    next()

})

io.on('connection', async (socket) => {
    const userData:jwtData = socket.data.user

    let expIn:number = userData.exp * 1000 - Date.now() 

    setTimeout(() => {
        socket.disconnect()
    }, expIn)

   
    socket.join(`User:${userData.user_id}`)

    socket.on("disconnect", (reason) => {
        console.log(`user disconnected: ${reason}`)
    })

    socket.on("sendMessage", async (req:MessageType, callback) => {
        try{
            const messageRes = await db.query('INSERT INTO messages (chat_id, sender_id, body, created_at) VALUES ($1, $2, $3, $4) RETURNING id', 
                [req.chat_id, req.sender_id, req.body, req.created_at]
            )
            console.log(messageRes.rows)
            const participants = await db.query('SELECT user_id FROM chat_members WHERE chat_id = $1', 
                [req.chat_id]
            )
            for(let i=0; i<participants.rows.length; i++){
                io.to(`User:${participants.rows[i].user_id}`).emit("newMessage", {...req, id:messageRes.rows[0].id})
            }
            callback({
                ok:true,
                message:"Message Sent!"
            })
        }catch(err){
            console.log(err)
            callback({
                ok:false,
                message:err
            })
        }

        
    })
})



server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    
})
