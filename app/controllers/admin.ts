import { type Request, type Response, type NextFunction } from 'express';
import * as adminService from '../services/admin.ts';
import { appError } from '../../utils/appErrors.ts';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.file)
           throw new appError('please upload product image',400);
        const imageBuffer=req.file.buffer
        const product = await adminService.createProduct(imageBuffer,req.body);
        res.status(201).json({ message: "Product created successfully", data: product });
    } catch (error) { next(error); }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imageBuffer = req.file ? req.file.buffer : undefined;
        const product = await adminService.updateProduct(req.params.id as string, imageBuffer, req.body);
        res.status(200).json({ message: "Product updated successfully", data: product });
    } catch (error) { next(error); }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await adminService.deleteProduct(req.params.id as string);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) { next(error); }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await adminService.getAllOrders();
        res.status(200).json({ message: "Orders retrieved successfully", data: orders });
    } catch (error) { next(error); }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body;
        if (!status) throw new appError("Status is required", 400);

        const order = await adminService.updateOrderStatus(req.params.id as string, status);
        res.status(200).json({ message: "Order status updated", data: order });
    } catch (error) { next(error); }
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json({ message: "Dashboard stats retrieved", data: stats });
    } catch (error) { next(error); }
};