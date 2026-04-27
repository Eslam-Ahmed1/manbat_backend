import express, { type RequestHandler } from "express";
import * as productController from '../controllers/product.ts'
const router=express.Router();
router.get('/',productController.getAllproduct as RequestHandler)
router.get('/:id',productController.getProductById as RequestHandler)
export default router;