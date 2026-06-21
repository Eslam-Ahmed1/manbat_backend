import express from 'express';
import multer from 'multer';
import Authorization from '../middlewares/authMiddleware.js';
import { analyzePlantImageController, getScanHistoryController, getScanHistoryByPlantIdController } from '../controllers/scan.js';
const router = express.Router();
// Use memory storage so we get the file as a Buffer (req.file.buffer)
const upload = multer({ storage: multer.memoryStorage() });
// planetImage this is the name like name of file input of html form
router.post('/', Authorization, upload.single('plantImage'), analyzePlantImageController);
router.get('/', Authorization, getScanHistoryController);
router.get('/:id', Authorization, getScanHistoryByPlantIdController);
export default router;
