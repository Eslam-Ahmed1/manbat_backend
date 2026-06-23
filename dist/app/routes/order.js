import express from 'express';
import * as orderController from '../controllers/order.js';
import Authorization from '../middlewares/authMiddleware.js';
const router = express.Router();
router.use(Authorization);
router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
export default router;
