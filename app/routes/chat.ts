import express, {type RequestHandler } from "express";
import Authorization from "../middlewares/authMiddleware.ts";
import { chatController } from "../controllers/index.ts";
const route = express.Router();
//i will use user authorization 
//create new chat
route.post('/new_chat', Authorization as RequestHandler, chatController.new_chat as RequestHandler)
//load all chats_Id 
route.get('/chat_ids', Authorization as RequestHandler, chatController.chat_ids as RequestHandler)
//when user send message to Ai
route.post('/:chat_id/messages', Authorization as RequestHandler, chatController.send_message as RequestHandler)
//recieve all meessage for specific chat_id
route.get('/:chat_id/messages', Authorization as RequestHandler, chatController.messages as RequestHandler)
export default route;