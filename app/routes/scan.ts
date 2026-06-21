import express, { type RequestHandler, type Response, type Request, type NextFunction } from 'express';
import multer from 'multer';
import Authorization from '../middlewares/authMiddleware.js';
import { analyzePlantImageController, getScanHistoryController, getScanHistoryByPlantIdController } from '../controllers/scan.js';

const router = express.Router();

// Use memory storage so we get the file as a Buffer (req.file.buffer)
const upload = multer({ storage: multer.memoryStorage() });
// planetImage this is the name like name of file input of html form
router.post('/', Authorization as RequestHandler, upload.single('plantImage'), analyzePlantImageController as RequestHandler);
router.get('/', Authorization as RequestHandler, getScanHistoryController as RequestHandler);
router.get('/:id', Authorization as RequestHandler, getScanHistoryByPlantIdController as RequestHandler);
export default router;