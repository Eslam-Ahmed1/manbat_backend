import Message from "../models/messages.ts";
import Chat from "../models/chats.ts";
import { chatService } from "../services/index.ts";
import { appError } from "../../utils/appErrors.ts";
const send_message = async (req, res, next) => {
    try {
        const chatDTO = {
            chat_id: req.params.chat_id,
            content: req.body.content
        }
        const AiText = await chatService.send_message(chatDTO);
        return res.status(200).json({ aiMessage: AiText });
    }
    catch (err) { next(err) }
}
const messages = async (req, res, next) => {
    try {
        const chatId = req.params.chat_id;
        const userId=req.user._id;
        const isChatExist=await Chat.findOne({_id:chatId,user_id:userId})
        if(!isChatExist) throw new appError("invalid chat id ",400)
        const messages = await Message.find({ chat_id: chatId }).sort({ sent_at: 1 })
        res.status(200).json(messages);
    }
    catch (err) { next(err) }
}
const new_chat = async (req, res, next) => {
    try {
        const userDTO = {
            _id: req.user._id
        }
        const chatId = await chatService.new_chat(userDTO)
        return res.status(201).json({ chat_Id: chatId })
    }
    catch (err) { next(err) }
}
const chat_ids = async (req, res, next) => {
    try {
        const userId = req.user._id;
        //newest chat first in sidebar
        const chats = await Chat.find({ user_id: userId }, { _id: 1 }).sort({ created_at: -1 })
        return res.status(201).json(chats)
    }
    catch (err) { next(err) }
}
export { send_message, messages, new_chat, chat_ids }