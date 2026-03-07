import mongoose from "mongoose"
let chatSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
})
const Chat =mongoose.model('chat',chatSchema);
export default Chat;