import * as orderService from '../services/order.js';
import { appError } from '../../utils/appErrors.js';
export const createOrder = async (req, res, next) => {
    try {
        const { shipping_address, phone } = req.body;
        if (!shipping_address)
            throw new appError("Shipping address is required", 400);
        const order = await orderService.createOrder(req.user._id, shipping_address, phone);
        res.status(201).json({ message: "Order placed successfully", data: order });
    }
    catch (error) {
        next(error);
    }
};
export const getUserOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getUserOrders(req.user._id);
        res.status(200).json({ message: "Orders retrieved successfully", data: orders });
    }
    catch (error) {
        next(error);
    }
};
