import express from "express";
import Authorization from "../middlewares/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {handleChat} from "../controllers/index.js";
const route=express.Router();
//this not completed so far
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model=genAI.getGenerativeModel({model:"gemini-2.5-flash"})
//when user send message to Ai
route.post('/:chat_id/send_message',Authorization,handleChat.send_message)
//recieve all meessage for specific chat_id
route.get('/:chat_id/messages',Authorization,handleChat.messages)
//create new chat
//i will use user authorization 
route.post('/new_chat',Authorization,handleChat.new_chat)
//load all chats_Id 
route.get('/chat_ids',Authorization,handleChat.chat_ids)
export default route;