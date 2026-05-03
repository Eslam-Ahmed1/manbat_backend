import { type Request, type Response, type NextFunction } from 'express';
import * as productService from '../services/product.ts';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.query automatically parses the URL: ?page=1&search=oil -> { page: '1', search: 'oil' }
        const result = await productService.getAllProducts(req.query);
        
        res.status(200).json({ message: "Products retrieved successfully", data: result });
    } catch (error) { next(error); }
};