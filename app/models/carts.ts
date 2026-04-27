import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'product'
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true, 
        unique: true 
    },
    items: [cartItemSchema],
    total_price: { type: Number, default: 0 }
}, { timestamps: true });

const Cart = mongoose.model('cart', cartSchema);
export default Cart;