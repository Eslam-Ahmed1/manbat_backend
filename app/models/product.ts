import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image_url: { type: String },
    quantity: { type:Number, required: true }
});
const Product = mongoose.model('product', productSchema);
export default Product;