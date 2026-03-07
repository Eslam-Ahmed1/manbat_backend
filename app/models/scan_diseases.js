import mongoose from "mongoose"
let scan_diseasesSchema=new mongoose.Schema({
    scan_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'plantScan'
    },
    disease_id:{
       type:mongoose.Schema.Types.ObjectId,
        ref:'disease'
    }
})
const Scan_disease =mongoose.model('scan_disease',scan_diseasesSchema);
export default Scan_disease;