import mongoose from "mongoose";
import Disease from "./diseases.ts";

let treatmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    image_url: {
        type: String
    },
    disease_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'disease'
    }]
});

Disease.syncIndexes();
const Treatment = mongoose.model('treatment', treatmentSchema);
export default Treatment;