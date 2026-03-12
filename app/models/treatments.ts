import mongoose from "mongoose"
let treatmentsSchema = new mongoose.Schema({
    disease_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'disease'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})
const Treatment = mongoose.model('treatment', treatmentsSchema);
export default Treatment;