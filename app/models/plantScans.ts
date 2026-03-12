import mongoose from "mongoose"
let plantScanSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    plant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plant'
    },
    image_url: {
        type: String,
        required: true
    },
    scan_date: {
        type: Date,
        default: Date.now
    },
    //plant status after scaned infected or healthy 
    status: {
        type: String,
        required: true
    },
    //this property instead of make scan_disease schema
    disease_ids:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'disease'
    }]
})
const PlantScan = mongoose.model('plantScan', plantScanSchema);
export default PlantScan;