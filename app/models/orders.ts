import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'product' 
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [orderItemSchema],
    total_amount: { type: Number, required: true },
    shipping_address: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    }
}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);
export default Order;