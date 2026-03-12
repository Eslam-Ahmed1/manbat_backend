import mongoose from "mongoose"
let plantSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    name: {
        type: String,
        required: true
    }
})
const Plant = mongoose.model('plant', plantSchema);
export default Plant;