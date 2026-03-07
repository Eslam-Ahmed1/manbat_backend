import mongoose from "mongoose"
let messageSchema=new mongoose.Schema({
    chat_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'chat'
    },
    // Caution:is the sender person or AI
    sender:{
        type:String,
        enum:['user','ai'],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    sent_at:{
        type:Date,
        default:Date.now()
    }
})
const Message =mongoose.model('message',messageSchema);
export default Message;