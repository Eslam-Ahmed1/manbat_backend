import express from 'express';
import * as productController from '../controllers/product.js';
const router = express.Router();
// Public Routes
router.get('/', productController.getProducts);
router.get('/categories', productController.getProductCategories);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);
export default router;
