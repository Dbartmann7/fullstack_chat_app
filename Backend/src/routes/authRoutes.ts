import express from "express";
import { login, logout, signUp, verifyJWT } from "../controllers/users";


const authRouter = express.Router()

authRouter.route("/login").post(login)
authRouter.route("/logout").post(logout)
authRouter.route("/signup").post(signUp)
authRouter.route("/me").get(verifyJWT)
export default authRouter