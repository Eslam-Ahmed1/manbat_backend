import Cart from "../models/carts.ts";
import { appError } from "../../utils/appErrors.ts";

export const getCart = async (userId: string) => {
    let cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
    if (!cart) {
        cart = await Cart.create({ user_id: userId, items: [], total_price: 0 });
    }
    return cart;
};

export const addToCart = async (userId: string, productId: string, productModel: string, quantity: number, price: number) => {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
        cart = new Cart({ user_id: userId, items: [], total_price: 0 });
    }

    const existingItemIndex = cart.items.findIndex(item => item.product_id.toString() === productId);
    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ product_id: productId, productModel, quantity, price } as any);
    }

    cart.total_price = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    return await cart.populate('items.product_id');
};

export const removeFromCart = async (userId: string, productId: string) => {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) throw new appError("Cart not found", 404);

    cart.items = cart.items.filter(item => item.product_id.toString() !== productId) as any;
    cart.total_price = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    return await cart.populate('items.product_id');
};