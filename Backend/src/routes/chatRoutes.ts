import express from "express";
import { getChats } from "../controllers/chats";


const chatRouter = express.Router()

chatRouter.route("/").get(getChats)
export default chatRouter