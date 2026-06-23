import mongoose from "mongoose";
let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});
const Category = mongoose.model('category', categorySchema);
export default Category;
