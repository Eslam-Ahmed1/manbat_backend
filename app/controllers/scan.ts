import express, { type RequestHandler, type Response, type Request, type NextFunction } from 'express';
import { analyzePlantImage, getScanHistory, getScanHistoryByPlantId } from '../services/scan.ts';
import { appError } from '../../utils/appErrors.ts';
const analyzePlantImageController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new appError('No image file provided. Please upload a plantImage.', 400);
        }

        const userId = req.user._id;
        const scanResult = await analyzePlantImage(userId, req.file.buffer, req.file.mimetype);

        res.status(200).json({ message: "Scan completed", data: scanResult });
    } catch (error) {
        console.log(error);
        next(error); // Pass to global error handler
    }
}
const getScanHistoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;
        const scanHistory = await getScanHistory(userId);
        res.status(200).json({ message: "get plants scand history, completed", data: scanHistory })

    } catch (error) {
        next(error); // Pass to global error handler
    }
}
const getScanHistoryByPlantIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //// for more solidity we need first get user related by this id and compare with current user (but why i need this in mobile app)
        console.log(req.user);
        const plantId = req.params.id;
        const scanHistoryByPlantId = await getScanHistoryByPlantId(plantId as string);
        res.status(200).json({ message: "get plant scand history, completed", data: scanHistoryByPlantId })

    } catch (error) {
        next(error); // Pass to global error handler
    }
}
export { analyzePlantImageController, getScanHistoryController, getScanHistoryByPlantIdController }