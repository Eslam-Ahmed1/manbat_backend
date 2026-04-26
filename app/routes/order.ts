import express, { type RequestHandler } from 'express';
import * as orderController from '../controllers/order.ts';
import Authorization from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.use(Authorization as RequestHandler);

router.post('/', orderController.createOrder as RequestHandler);
router.get('/', orderController.getUserOrders as RequestHandler);

export default router;