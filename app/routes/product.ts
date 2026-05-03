import express, { type RequestHandler } from 'express';
import * as productController from '../controllers/product.ts';

const router = express.Router();

// Public Route: Get all products (supports pagination, search, and filtering)
router.get('/', productController.getProducts as RequestHandler);

export default router;