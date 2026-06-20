import { type Request, type Response, type NextFunction } from 'express';
import * as orderService from '../services/order.ts';
import { appError } from '../../utils/appErrors.ts';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { shipping_address, phone } = req.body;
        if (!shipping_address) throw new appError("Shipping address is required", 400);

        const order = await orderService.createOrder(req.user._id as string, shipping_address, phone);
        res.status(201).json({ message: "Order placed successfully", data: order });
    } catch (error) { next(error); }
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderService.getUserOrders(req.user._id as string);
        res.status(200).json({ message: "Orders retrieved successfully", data: orders });
    } catch (error) { next(error); }
};