import { jwtData } from "@shared/types";
import { Request, Response } from "express";
import  jwt from "jsonwebtoken";

import { db } from "@/db";

export const getChats = async (req:Request, res:Response) => {

    try{
        let userData = jwt.verify(req.cookies.token, process.env.JWT_KEY!) as jwtData
        const chatsRes = await db.query(`SELECT cm.chat_id AS id, cm2.user_id AS partner_id, u.username AS partner FROM chat_members cm
                JOIN chat_members cm2 ON cm.chat_id = cm2.chat_id
                JOIN users u ON cm2.user_id = u.id
                WHERE cm.user_id = $1 AND cm2.user_id != $1
                ;`,
            [userData.user_id]
        )
            
        console.log(chatsRes.rows)
        let chats = chatsRes.rows
        for(let i=0; i<chats.length; i++){
            let messages = (await db.query(`SELECT * FROM messages WHERE chat_id = $1
                                            ORDER BY created_at ASC`, 
                            [chats[i].id])).rows || []    
            chats[i] = {...chats[i], messages:messages}
            console.log(chats[i])
        }
        
        res.status(200).send({ok:true, body:chats, message:"Chats Fetched Successfully!"})
    }catch(err){
        res.status(500).send({ok:false, message:err})
    }

}

export const createChat = async (req:Request, res:Response) => {
    const {user_id1, user_id2} = req.body
    
    try{
        const existingChat = (await db.query(`
            SELECT chat_id FROM chat_members
            WHERE user_id IN ($1, $2)
            GROUP BY chat_id HAVING COUNT(user_id) = 2
        `, [user_id1, user_id2])).rows
        if(existingChat.length > 0){
            res.status(200).send({message:"Chat already exists", ok:false})
            return
        }

        const dbRes = await db.query(`
            INSERT INTO chats DEFAULT VALUES
            RETURNING id
        `)
        
        const chat_id = dbRes.rows[0].id

        await db.query(`
            INSERT INTO chat_members(chat_id, user_id) VALUES
            ($1, $2), ($1, $3)
        `, [chat_id, user_id1, user_id2])

        res.status(200).send({message:"chat successfully created", ok:true})
    }catch(err){
        console.log(err)
        res.status(500).send({message:"there was a problem creating the chat", ok:false})
    }
}