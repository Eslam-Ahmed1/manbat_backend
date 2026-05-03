import mongoose from "mongoose";
import Disease from "./diseases.ts";

let treatmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    instructions: {
        type: String
    },
    disease_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'disease'
    }]
});

const Treatment = mongoose.model('treatment', treatmentSchema);
Treatment.syncIndexes();

export default Treatment;