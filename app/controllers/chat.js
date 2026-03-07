import Message from "../models/messages.js";
import Chat from "../models/chats.js";
import { chatSevice } from "../services/index.js";
const send_message=async (req,res)=>{
    try{
        const chatDTO={
            chat_id:req.params.chat_id,
            content:req.body.content
        }
        const AiText=await chatSevice.send_message(chatDTO);
        res.status(200).json({aiMessage:AiText});
    }
    catch(err){res.status(500).json({msg:"server error when user send message to ai chat"})}
}
const messages=async (req,res)=>{
    try{
        const chatId=req.params.chat_id;
        const messages=await Message.find({chat_id:chatId}).sort({sent_at:1})
        console.log(messages);
        res.json(messages);
    }
    catch(err){res.status(500).json({msg:"server error when send chat messages"})}
}
const new_chat=async (req,res)=>{
    try{
        const userDTO={
             _id:req.user._id
        }
        const chatId=await chatSevice.new_chat(userDTO) 
        res.status(201).json({chatId:chatId})
    }
    catch(err){console.log(err);res.status(500).json({msg:'server error when create new chat id'})}
}
const chat_ids=async (req,res)=>{
    try{
         const userId=req.user._id;
         //newest chat first in sidebar
         const chats=await Chat.find({user_id:userId},{_id:1}).sort({created_at:-1})
        res.json(chats)
    }
    catch(err){console.log(err);res.status(500).json({msg:'server error when try get all chat ids'})}
}
export{send_message,messages,new_chat,chat_ids}