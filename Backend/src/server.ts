import express from 'express'
import { createServer} from 'node:http'
import cors from "cors"
import * as cookie from "cookie"
import cookieParser from "cookie-parser"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { StatusCodes } from "http-status-codes";
import type { ChatData, jwtData, SocketRes } from '@custom-types/types'
import dotenv from "dotenv"
import {pool} from './db';
dotenv.config()
const JWT_KEY:string | undefined = process.env.JWT_KEY
if(!JWT_KEY) {
    throw new Error("NO JWT KEY, PLEASE SET A JWT KEY")
}
//  ************************* Express Setup *************************  \\
const PORT:number = 3000
const app = express()
app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
}))
app.use(express.json())
app.use(cookieParser())
const server = createServer(app)

let tempChatStorage:ChatData[] = []

const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        credentials:true
    }
})

app.get('/', (req, res) => {
    res.send("Server for Chat App")
})

const JWT_LIFE:number = 60 * 60 * 1000
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

app.post('/login', async (req, res) => {

    // check jwt
    const tokenData = verifyJWT(req.cookies.token)
    if(tokenData){
        res.status(200).send({message:"Login Successful", userData:tokenData})
        return
    }

    // check login info
    const {username, password} = req.body
    if(!username || !password) return


    const userData =  (await pool.query(`SELECT * FROM users WHERE username=\'${username}\'`)).rows[0]
    if(!userData){
        res.status(401).send("Invalid username or password")
        return
    } else {
        if(password !== userData.password){
            res.status(401).send("Invalid username or password")
            return
        }else{
            let payload:jwtData = {username:username}
            let token = jwt.sign(payload, JWT_KEY, {expiresIn:`${JWT_LIFE}ms`})
            res.cookie("token", token, {
                httpOnly:true,
                secure: false,
                sameSite:"lax",
                maxAge: JWT_LIFE

            })
            .status(200).send("login successful")
        }
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
    console.log(expIn)
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
