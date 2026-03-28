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
import {pool} from './db';
dotenv.config()

const JWT_KEY:string | undefined = process.env.JWT_KEY
if(!JWT_KEY) {
    throw new Error("NO JWT KEY, PLEASE SET A JWT KEY")
}
const JWT_LIFE:number = 1 * 60 * 1000

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

app.get('/', (req, res) => {
    res.send("Server for Chat App")
})

// ************ Routes ************ //
app.post('/login', async (req, res) => {
    // check jwt
    const tokenData = verifyJWT(req.cookies.token)
    if(tokenData){
        res.status(200).send({message:"Login Successful", userData:tokenData})
        return
    }
    // check login info
    const {username, password} = req.body
    if(!username || !password) {
        res.status(401).send("Invalid username or password")
        return
    }
    

    const userData =  (await pool.query(`SELECT * FROM users WHERE username=\'${username}\'`)).rows[0]
    if(!userData){
        res.status(401).send("Invalid username or password")
        return
    } else {
        const isPassMatch = await bcrypt.compare(password, userData.password)
        
        if(!isPassMatch){
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

app.post("/signup", async (req, res) => {
    const {username, password} = req.body

    if(!username || !password) res.status(401).send("Invalid username or password");
    console.log("sggan")
    const existingUser = await pool.query('SELECT * FROM users WHERE username=$1', [username])
    console.log("iosajgfsao")
    if(existingUser.rowCount === 1){
        res.status(400).send("User with username already exists")
        return
    }
    try{
        const hashedPass = await bcrypt.hash(password, 10)
        const dbRes = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', 
            [username, hashedPass]
        )
        res.status(200).send("Account created successfully")
    }catch(err){
        res.status(400).send(`Error: ${err}`)
        console.log(err)
    }
    
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
