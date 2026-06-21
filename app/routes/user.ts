import express, { type RequestHandler } from 'express';
import * as userController from '../controllers/user.js';
import Authorization from '../middlewares/authMiddleware.js';
import multer from 'multer'
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.use(Authorization as RequestHandler);
router.get('/profile', userController.getProfile as RequestHandler);
router.put('/profile', upload.single("image"), userController.updateProfile as RequestHandler);
router.delete('/profile', userController.deleteAccount as RequestHandler);

export default router;