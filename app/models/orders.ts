import mongoose from "mongoose"
let orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    treatment_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'treatment'
    }],
    address: {
        type: String,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'In Transit', 'Delivered', 'Canceled', 'Faild'],
        default: 'Pending'
    },
    order_date: {
        type: Date,
        default: Date.now
    }
})
const Order = mongoose.model('order', orderSchema);
export default Order;