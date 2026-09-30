import express from "express";
import { findUsers, login, logout, signUp, verifyJWT } from "../controllers/users";


const userRouter = express.Router()

userRouter.route("/login").post(login)
userRouter.route("/logout").post(logout)
userRouter.route("/signup").post(signUp)
userRouter.route("/me").get(verifyJWT)
userRouter.route("/").get(findUsers)
export default userRouter