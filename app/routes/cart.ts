import express, { type RequestHandler } from 'express';
import * as cartController from '../controllers/cart.js';
import Authorization from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(Authorization as RequestHandler);

router.get('/', cartController.getCart as RequestHandler);
router.post('/add', cartController.addToCart as RequestHandler);
router.post('/remove', cartController.removeFromCart as RequestHandler);

export default router;