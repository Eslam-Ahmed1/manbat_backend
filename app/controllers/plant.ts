import { type Request, type Response, type NextFunction } from 'express';
import * as plantService from '../services/plant.ts';

export const getPlants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await plantService.getPlants(req.query);
        res.status(200).json({ message: "Plants retrieved successfully", data: result });
    } catch (error) {
        next(error);
    }
};

export const getPlantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plant = await plantService.getPlantById(req.params.id as string);
        res.status(200).json({ message: "Plant retrieved successfully", data: plant });
    } catch (error) {
        next(error);
    }
};
