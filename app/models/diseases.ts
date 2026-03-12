import mongoose from "mongoose"
let diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    }
})
const Disease = mongoose.model('disease', diseaseSchema);
export default Disease;