import express, { type RequestHandler, type Response, type Request ,type NextFunction } from 'express';
import multer from 'multer';
import { analyzePlantImage,getScanHistory, getScanHistoryByPlantId } from '../services/scan.ts';
import { appError } from '../../utils/appErrors.ts';
import Authorization from '../middlewares/authMiddleware.ts';
import { messages } from '../controllers/chat.ts';

const router = express.Router();

// Use memory storage so we get the file as a Buffer (req.file.buffer)
const upload = multer({ storage: multer.memoryStorage() });
//planetImage this is the name like name of file input of html form
router.post('/', Authorization as RequestHandler ,upload.single('plantImage'), async (req:any, res, next) => {
    try {
        if (!req.file) {
            throw new appError('No image file provided. Please upload a plantImage.', 400);
        }

        const userId = req.user._id; 
        const scanResult = await analyzePlantImage(userId, req.file.buffer, req.file.mimetype);
        
        res.status(200).json({ message: "Scan completed", data: scanResult });
    } catch (error) {
        next(error); // Pass to global error handler
    }
});
router.get('/', Authorization as RequestHandler ,async (req:any, res, next) => {
    try {
        const userId = req.user._id; 
        const scanHistory = await getScanHistory(userId);
        res.status(200).json({message:"get plants scand history, completed",data:scanHistory})
        
    } catch (error) {
        next(error); // Pass to global error handler
    }
});
router.get('/:id', Authorization as RequestHandler ,async (req:any, res, next) => {
    try {
        //// for more solidity we need first get user related by this id and compare with current user (but why i need this in mobile app)
        console.log(req.user);
        const plantId = req.params.id;
        const scanHistoryByPlantId = await getScanHistoryByPlantId(plantId);
        res.status(200).json({message:"get plant scand history, completed",data:scanHistoryByPlantId})
        
    } catch (error) {
        next(error); // Pass to global error handler
    }
});
export default router;