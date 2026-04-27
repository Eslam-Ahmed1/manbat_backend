import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    treatment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'treatment'
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image_url: { type: String },
    quantity: { type:Number, required: true }
});
const Product = mongoose.model('product', productSchema);
Product.syncIndexes();
export default Product;