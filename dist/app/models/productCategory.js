import mongoose from "mongoose";
const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    image_url: {
        type: String,
        trim: true
    }
}, { timestamps: true });
const ProductCategory = mongoose.model('product_category', productCategorySchema);
ProductCategory.syncIndexes();
export default ProductCategory;
