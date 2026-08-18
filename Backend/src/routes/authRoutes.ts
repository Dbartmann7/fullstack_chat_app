import express from "express";
import { login, signUp } from "../controllers/users";


const authRouter = express.Router()

authRouter.route("/login").post(login)
authRouter.route("/signup").post(signUp)

export default authRouter