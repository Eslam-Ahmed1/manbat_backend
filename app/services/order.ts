import Order from "../models/orders.ts";
import Cart from "../models/carts.ts";
import Product from "../models/product.ts";
import { appError } from "../../utils/appErrors.ts";

export const createOrder = async (userId: string, shippingAddress: string) => {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart || cart.items.length === 0) {
        throw new appError("Cannot place an order with an empty cart", 400);
    }

    const order = new Order({
        user_id: userId,
        items: cart.items,
        total_amount: cart.total_price,
        shipping_address: shippingAddress
    });
    await order.save();

    // Empty the user's cart after successful checkout
    cart.items = [] as any;
    cart.total_price = 0;
    await cart.save();
    return order;
};

export const getUserOrders = async (userId: string) => {
    return await Order.find({ user_id: userId }).sort({ createdAt: -1 }).populate('items.product_id');
};