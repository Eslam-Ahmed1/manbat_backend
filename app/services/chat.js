import Message from "../models/messages.js";
import Chat from "../models/chats.js";
const send_message=async (chatDTO)=>{
    const chatId=chatDTO.chat_id;
    const content=chatDTO.content;
    const userMessage=new Message({
        chat_id:chatId,
        sender:'user',
        content:content,
        sent_at:Date.now()
    })
    //here i think take previous 20 message for increase speed 
    //and avoid crash 
    const messageHistory=await Message.find({chat_id:chatId}).sort({sent_at:-1}).limit(20);
    await userMessage.save();
    let extractMessages = messageHistory.map(value=>{
        return {
        role:value.sender=="user"?"user":"model",
        parts:[{text:value.content}]}
        
    })
    extractMessages=extractMessages.reverse();
    
    console.log(extractMessages);
    const chatSessionInstance =model.startChat({history:extractMessages})
    const result =await chatSessionInstance.sendMessage(content);
    const AiText =result.response.text();
    const aiMessage=new Message({
        chat_id:chatId,
        sender:'ai',
        content:AiText,
        sent_at:Date.now()
    })
    await aiMessage.save();
    //we need to provide this messages to Ai 
    return AiText;
}
const new_chat= async (userDTO)=>{
   const userId=userDTO._id;
    const newChat=new Chat({
        user_id:userId,
        created_at:Date.now()
    });
    const chatId=(await newChat.save())._id;
    return chatId;
}