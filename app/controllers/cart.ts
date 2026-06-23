import {type Request,type Response, type NextFunction } from 'express';
import * as cartService from '../services/cart.js';
import { appError } from '../../utils/appErrors.js';

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await cartService.getCart(req.user._id as string);
        res.status(200).json({ message: "Cart retrieved successfully", data: cart });
    } catch (error) { next(error); }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { product_id, quantity, price } = req.body;
        if (!product_id || !quantity || price === undefined) {
            throw new appError("Missing required fields: product_id, quantity, price", 400);
        }
        const cart = await cartService.addToCart(req.user._id as string, product_id, quantity, price);
        res.status(200).json({ message: "Item added to cart", data: cart });
    } catch (error) { next(error); }
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { product_id } = req.body;
        if (!product_id) throw new appError("Missing product_id in request body", 400);
        
        const cart = await cartService.removeFromCart(req.user._id as string, product_id);
        res.status(200).json({ message: "Item removed from cart", data: cart });
    } catch (error) { next(error); }
};