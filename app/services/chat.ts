import Message from "../models/messages.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../models/chats.ts";
//this not completed so far
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
const send_message = async (chatDTO) => {
    const chatId = chatDTO.chat_id;
    const content = chatDTO.content;
    const userMessage = new Message({
        chat_id: chatId,
        sender: 'user',
        content: content
    })
    //here i think take previous 20 message for increase speed 
    //and avoid crash 
    const messageHistory = await Message.find({ chat_id: chatId }).sort({ sent_at: -1 }).limit(20);
    await userMessage.save();
    let extractMessages = messageHistory.map(value => {
        return {
            role: value.sender == "user" ? "user" : "model",
            parts: [{ text: value.content }]
        }

    })
    extractMessages = extractMessages.reverse();

    console.log(extractMessages);
    const chatSessionInstance = model.startChat({ history: extractMessages })
    const result = await chatSessionInstance.sendMessage(content);
    const AiText = result.response.text();
    const aiMessage = new Message({
        chat_id: chatId,
        sender: 'ai',
        content: AiText
    })
    await aiMessage.save();
    //we need to provide this messages to Ai 
    return AiText;
}
const new_chat = async (userDTO) => {
    const userId = userDTO._id;
    const newChat = new Chat({
        user_id: userId
    });
    const chatId = (await newChat.save())._id;
    return chatId;
}

export { new_chat, send_message }
