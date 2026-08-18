import express from 'express'
import bcrypt from "bcrypt"
import { createServer} from 'node:http'
import cors from "cors"
import * as cookie from "cookie"
import cookieParser from "cookie-parser"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { StatusCodes } from "http-status-codes";
import type { ChatData, jwtData, SocketRes } from '@custom-types/types'
import dotenv from "dotenv"
import "dotenv/config";
import {pool} from './db';
import authRouter from './routes/authRoutes'
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
    console.log(data)
    if(!data){
        socket.disconnect()
        return
    }
    let expIn:number = data.exp! * 1000 - Date.now() || 1

    setTimeout(() => {
        socket.disconnect()
    }, expIn)

    console.log("user connected")

    socket.on("disconnect", (reason) => {
        console.log(`user disconnected: ${reason}`)
    })

    socket.on("sendMessage", (req:ChatData, callback) => {
        
        console.log(req)
        tempChatStorage.push(req)
        callback({
            status:StatusCodes.OK
        })
    })
})



server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    
})
