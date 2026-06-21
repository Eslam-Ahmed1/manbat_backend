import { type Request, type Response, type NextFunction } from 'express';
import * as productService from '../services/product.js';
import * as productCategoryService from '../services/productCategory.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.getAllProducts(req.query);
        res.status(200).json({ message: "Products retrieved successfully", data: result });
    } catch (error) { next(error); }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProductById(req.params.id as string);
        const relatedProducts = await productService.getRelatedProducts(req.params.id as string);
        
        res.status(200).json({ 
            message: "Product retrieved successfully", 
            data: {
                product,
                relatedProducts
            }
        });
    } catch (error) { next(error); }
};

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 6;
        const products = await productService.getFeaturedProducts(limit);
        res.status(200).json({ message: "Featured products retrieved successfully", data: products });
    } catch (error) { next(error); }
};

export const getProductCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await productCategoryService.getAllCategories();
        res.status(200).json({ message: "Product categories retrieved successfully", data: categories });
    } catch (error) { next(error); }
};