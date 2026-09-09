import express from 'express'
import { createServer} from 'node:http'
import cors from "cors"
import * as cookie from "cookie"
import cookieParser from "cookie-parser"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { StatusCodes } from "http-status-codes";
import type { ChatData, jwtData, Message, SocketRes } from '@shared/types'
import dotenv from "dotenv"
import "dotenv/config";
import authRouter from './routes/authRoutes'
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

app.use("/api/auth", authRouter)
app.use("/api/chat", chatRouter)
app.get('/', (req, res) => {
    res.send("Server for Chat App")
})

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

   
    socket.join(`User:${userData.username}`)

    socket.on("disconnect", (reason) => {
        console.log(`user disconnected: ${reason}`)
    })

    socket.on("sendMessage", async (req:Message, callback) => {
        try{
            const dbRes = await db.query('INSERT INTO messages (chat_id, sender_id, body, created_at) VALUES ($1, $2, $3, $4)', 
                [req.chat_id, req.sender_id, req.body, req.created_at]
            )
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
