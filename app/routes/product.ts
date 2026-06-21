import express, { type RequestHandler } from 'express';
import * as productController from '../controllers/product.js';

const router = express.Router();

// Public Routes
router.get('/', productController.getProducts as RequestHandler);
router.get('/categories', productController.getProductCategories as RequestHandler);
router.get('/featured', productController.getFeaturedProducts as RequestHandler);
router.get('/:id', productController.getProductById as RequestHandler);

export default router;