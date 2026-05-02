import express, { type RequestHandler } from 'express';
import * as adminController from '../controllers/admin.ts';
import Authorization from '../middlewares/authMiddleware.ts';
import AdminAuthorization from '../middlewares/adminMiddleware.ts';
import multer, { memoryStorage } from 'multer';
const router = express.Router();
const upload=multer({storage:multer.memoryStorage()})
// ALL routes in this file are protected and require ADMIN privileges
router.use(Authorization as RequestHandler, AdminAuthorization as RequestHandler);

// Dashboard
router.get('/stats', adminController.getDashboardStats as RequestHandler);

// Product Management
router.post('/product',upload.single('productImage'), adminController.createProduct as RequestHandler);
router.put('/product/:id', upload.single('productImage'), adminController.updateProduct as RequestHandler);
router.delete('/product/:id', adminController.deleteProduct as RequestHandler);

// Order Management
router.get('/orders', adminController.getAllOrders as RequestHandler);
router.put('/orders/:id/status', adminController.updateOrderStatus as RequestHandler);

export default router;