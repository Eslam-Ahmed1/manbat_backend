import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    treatment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'treatment',
        default: null
    },
    product_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product_category',
        default: null
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    image_url: { type: String },
    quantity: { type: Number, required: true }
}, { timestamps: true });

// Virtual for checking stock status dynamically
productSchema.virtual('status').get(function() {
    if (this.quantity === 0) return 'out_of_stock';
    if (this.quantity <= 10) return 'low_stock';
    return 'in_stock';
});

// Virtual for calculating the discounted price
productSchema.virtual('discountedPrice').get(function() {
    if (this.discount > 0) {
        return Math.round((this.price * (1 - this.discount / 100)) * 100) / 100;
    }
    return this.price;
});

// Ensure virtuals are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('product', productSchema);
Product.syncIndexes();
export default Product;