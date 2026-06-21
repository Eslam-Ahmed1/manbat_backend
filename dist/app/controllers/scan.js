import { analyzePlantImage, getScanHistory, getScanHistoryByPlantId } from '../services/scan.js';
import { appError } from '../../utils/appErrors.js';
const analyzePlantImageController = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new appError('No image file provided. Please upload a plantImage.', 400);
        }
        const userId = req.user._id;
        const scanResult = await analyzePlantImage(userId, req.file.buffer, req.file.mimetype);
        res.status(200).json({ message: "Scan completed", data: scanResult });
    }
    catch (error) {
        console.log(error);
        next(error); // Pass to global error handler
    }
};
const getScanHistoryController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const scanHistory = await getScanHistory(userId, req.query);
        res.status(200).json({ message: "get plants scand history, completed", data: scanHistory });
    }
    catch (error) {
        next(error); // Pass to global error handler
    }
};
const getScanHistoryByPlantIdController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const scanId = req.params.id;
        const result = await getScanHistoryByPlantId(scanId, userId);
        res.status(200).json({ message: "Scan details retrieved", data: result });
    }
    catch (error) {
        next(error); // Pass to global error handler
    }
};
export { analyzePlantImageController, getScanHistoryController, getScanHistoryByPlantIdController };
