import { jwtData } from "@shared/types"
import {db} from "../db"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {Request, Response} from "express"
import { JWT_LIFE } from "../util/auth"

export const verifyJWT = async (req:Request, res:Response) => {
    // if valid jwt exists, login straight away
    const token = req.cookies.token
    console.log(token)
    if(!token){
        res.status(401).send({message:"Invalid credentials"})    
        return
    }
    try{
        const tokenData = jwt.verify(token, process.env.JWT_KEY!) as jwtData
   
        res.status(200).send({message:"Valid credentials", userData:tokenData})
        return
    }catch(err){
        res.status(401).send({message:"Invalid Credentials"})
        return 
    }
}

export const login = async (req:Request, res:Response) => {

    

    // check login info
    const {username, password} = req.body
    if(!username || !password) {
        res.status(401).send({message:"Empty username or password"})
        return
    }

    // fetch user data from db and match username and password
    const userData = (await db.query('SELECT * FROM users WHERE username=$1', [username])).rows[0]
    if(!userData){
        res.status(401).send({message:"Invalid username or password"})
        return
    } 
    const isPassMatch = await bcrypt.compare(password, userData.password)
    if(!isPassMatch){
        res.status(401).send({message:"Invalid username or password"})
        return
    }

    // create jwt and login
    let payload = {username:username, user_id:userData.id}
    let token = jwt.sign(payload, process.env.JWT_KEY!, {expiresIn:`${JWT_LIFE}ms`})

    res.cookie("token", token, {
        httpOnly:true,
        secure: false,
        sameSite:"lax",
        maxAge: JWT_LIFE
    }).status(200).send({message:"login successful"})

}

export const logout = async (req:Request, res:Response) => {
    res.clearCookie("token")
    res.status(200).send({ok:true, message:"JWT Deleted"})
} 

export const signUp = async (req:Request, res:Response) => {
  
    const {username, password} = req.body
    if(!username || !password) {
        res.status(401).send({message:"Empty username or password"});
        return
    }

    // check if username is taken
    // db already forbids duplicates, but this allows a relevant message to be displayed. 
    const existingUser = await db.query('SELECT * FROM users WHERE username=$1', [username])
    if(existingUser.rows.length > 0){
        res.status(400).send({message:"User already exists"})
        return
    }
    
    try{
        const hashedPass = await bcrypt.hash(password, 10)
        const dbRes = await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', 
            [username, hashedPass]
        )
        res.status(200).send({message:"Account created successfully", ok:true})
    }catch(err){
        res.status(500).send({message:"Error creating account"})
        console.log(err)
    }
    
}
