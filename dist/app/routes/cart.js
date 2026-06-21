import express from 'express';
import * as cartController from '../controllers/cart.js';
import Authorization from '../middlewares/authMiddleware.js';
const router = express.Router();
router.use(Authorization);
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/remove', cartController.removeFromCart);
export default router;
