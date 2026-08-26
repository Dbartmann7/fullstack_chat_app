import express from 'express'
import { createServer} from 'node:http'
import cors from "cors"
import * as cookie from "cookie"
import cookieParser from "cookie-parser"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { StatusCodes } from "http-status-codes";
import type { ChatData, jwtData, SocketRes } from '@shared/types'
import dotenv from "dotenv"
import "dotenv/config";
import authRouter from './routes/authRoutes'
import { db } from './db'
dotenv.config()

const JWT_KEY:string | undefined = process.env.JWT_KEY
if(!JWT_KEY) {
    throw new Error("NO JWT KEY, PLEASE SET A JWT KEY")
}
const JWT_LIFE:number = 60 * 60 * 1000

let tempChatStorage:ChatData[] = []



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


io.on('connection', async (socket) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const data:jwtData | null = verifyJWT(cookies.token)
    
    if(!data){
        socket.disconnect()
        return
    }
    let expIn:number = data.exp! * 1000 - Date.now() || 1

    setTimeout(() => {
        socket.disconnect()
    }, expIn)


    socket.on("disconnect", (reason) => {
        console.log(`user disconnected: ${reason}`)
    })

    socket.on("sendMessage", async (req:ChatData, callback) => {
        
        try{
            const dbRes = await db.query('INSERT INTO chats (sender, reciever, body) VALUES ($1, $2, $3)', 
                [req.from, req.to, req.text]
            )
            callback({
                ok:true,
                message:"Message Sent!"
            })
        }catch(err){
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
