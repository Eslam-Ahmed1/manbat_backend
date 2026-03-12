import express from "express";
import Authorization from "../middlewares/authMiddleware.ts";
import { chatController } from "../controllers/index.ts";
const route = express.Router();
//i will use user authorization 
//create new chat
route.post('/new_chat', Authorization, chatController.new_chat)
//load all chats_Id 
route.get('/chat_ids', Authorization, chatController.chat_ids)
//when user send message to Ai
route.post('/:chat_id/messages', Authorization, chatController.send_message)
//recieve all meessage for specific chat_id
route.get('/:chat_id/messages', Authorization, chatController.messages)
export default route;