import express from "express";
import { login, signUp, verifyJWT } from "../controllers/users";


const authRouter = express.Router()

authRouter.route("/login").post(login)
authRouter.route("/signup").post(signUp)
authRouter.route("/me").post(verifyJWT)
export default authRouter