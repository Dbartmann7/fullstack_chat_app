import express from "express";
import { createChat, getChats } from "../controllers/chats";


const chatRouter = express.Router()

chatRouter.route("/").get(getChats)
chatRouter.route("/").post(createChat)
export default chatRouter