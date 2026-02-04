import express from 'express'
import { createServer} from 'node:http'
import cors from "cors"
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
    const tokenData = verifyJWT(req.cookies.token)
   
    if(!tokenData){
        const {username, password} = req.body || {}
        if(!username || !password){
            res.status(400).send("Login Failed")
            return
        }else{
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
                    let token = jwt.sign(payload, JWT_KEY, {expiresIn:"5m"})
                    res.cookie("token", token, {
                        httpOnly:true,
                        secure: false,
                        sameSite:"lax",
                        maxAge: 5 * 60 * 1000

                    })
                    .status(200).send("login successful")
                }
            }
        }
    }else{
        res.status(200).send({message:"Login Successful", userData:tokenData})
        // , userData:{username:tokenData.username}})
    }
})

io.on('connection', async (socket) => {

    console.log("user connected")
    console.log(process.env.JWT_KEY)
    const result = await pool.query('SELECT * FROM users;')
    // socket.emit("test", result)

    socket.on("disconnect", (reason) => {
        console.log("user disconnected")
    })

    socket.on("sendMessage", (req:ChatData, callback) => {
    
        console.log(socket.handshake.headers.cookie)
        tempChatStorage.push(req)
        // verifyJWT(socket.handshake.headers.cookie)
        callback({
            status:StatusCodes.OK
        })
    })
})



server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    
})
