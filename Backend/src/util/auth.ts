import { jwtData } from "@custom-types/types"

import jwt from "jsonwebtoken"

export const JWT_LIFE:number = 60 * 60 * 1000 


export const verifyJWT = (token:string | undefined): jwtData | null => {

    if(!token){
        return null
    }
    try{
        const tokenData = jwt.verify(token, process.env.JWT_KEY!) as jwtData
        return tokenData
    }catch(err){
        return null
    }
}