import * as productService from '../services/product.js';
import * as productCategoryService from '../services/productCategory.js';
export const getProducts = async (req, res, next) => {
    try {
        const result = await productService.getAllProducts(req.query);
        res.status(200).json({ message: "Products retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
export const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        const relatedProducts = await productService.getRelatedProducts(req.params.id);
        res.status(200).json({
            message: "Product retrieved successfully",
            data: {
                product,
                relatedProducts
            }
        });
    }
    catch (error) {
        next(error);
    }
};
export const getFeaturedProducts = async (req, res, next) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 6;
        const products = await productService.getFeaturedProducts(limit);
        res.status(200).json({ message: "Featured products retrieved successfully", data: products });
    }
    catch (error) {
        next(error);
    }
};
export const getProductCategories = async (req, res, next) => {
    try {
        const categories = await productCategoryService.getAllCategories();
        res.status(200).json({ message: "Product categories retrieved successfully", data: categories });
    }
    catch (error) {
        next(error);
    }
};
