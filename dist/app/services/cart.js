import Cart from "../models/carts.js";
import { appError } from "../../utils/appErrors.js";
export const getCart = async (userId) => {
    let cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
    if (!cart) {
        cart = await Cart.create({ user_id: userId, items: [], total_price: 0 });
    }
    return cart;
};
export const addToCart = async (userId, productId, quantity, price) => {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
        cart = new Cart({ user_id: userId, items: [], total_price: 0 });
    }
    const existingItemIndex = cart.items.findIndex(item => item.product_id.toString() === productId);
    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    }
    else {
        cart.items.push({ product_id: productId, quantity, price });
    }
    cart.total_price = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    return await cart.populate('items.product_id');
};
export const removeFromCart = async (userId, productId) => {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart)
        throw new appError("Cart not found", 404);
    cart.items = cart.items.filter(item => item.product_id.toString() !== productId);
    cart.total_price = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    return await cart.populate('items.product_id');
};
