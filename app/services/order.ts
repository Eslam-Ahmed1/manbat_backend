import Order from "../models/orders.ts";
import Cart from "../models/carts.ts";
import User from "../models/user.ts";
import Product from '../models/product.ts'
import { appError } from "../../utils/appErrors.ts";
import { sendOrderReceipt } from "./email.ts";

export const createOrder = async (userId: string, shippingAddress: string, phone: number) => {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart || cart.items.length === 0) {
        throw new appError("Cannot place an order with an empty cart", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new appError("User not found", 404);
    }

    const order = new Order({
        user_id: userId,
        items: cart.items,
        total_amount: cart.total_price,
        shipping_address: shippingAddress,
        phone: phone
    });
    await order.save();

    for (const item of cart.items) {
        const product = await Product.findById(item.product_id);
        if (!product) throw new appError(`Product not found`, 404);
        if (product.quantity < item.quantity) throw new appError(`Insufficient stock for product: ${product.name}`, 400);

        product.quantity -= item.quantity;
        await product.save();
    }

    // Empty the user's cart after successful checkout
    cart.items = [] as any;
    cart.total_price = 0;
    await cart.save();
    try {
        await sendOrderReceipt(user.email, user.name, order._id.toString(), order.total_amount);
    } catch (error) {
        console.error("Failed to send order receipt:", error);
    }
    return order;
};

export const getUserOrders = async (userId: string) => {
    return await Order.find({ user_id: userId }).sort({ createdAt: -1 }).populate('items.product_id');
};