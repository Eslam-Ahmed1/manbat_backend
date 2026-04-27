import express, { type RequestHandler } from 'express';
import * as userController from '../controllers/user.ts';
import Authorization from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.use(Authorization as RequestHandler);
router.get('/profile', userController.getProfile as RequestHandler);
router.put('/profile', userController.updateProfile as RequestHandler);

export default router;