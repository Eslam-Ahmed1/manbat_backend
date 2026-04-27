import {type Request,type Response,type NextFunction } from 'express';
import * as catalogService from '../services/catalog.ts';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await catalogService.getCategories();
        res.status(200).json({ message: "Categories retrieved successfully", data: categories });
    } catch (error) {
        next(error);
    }
};

export const getPlantsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plants = await catalogService.getPlantsByCategory(req.params.id as string);
        res.status(200).json({ message: "Plants retrieved successfully", data: plants });
    } catch (error) {
        next(error);
    }
};

export const getPlants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plants = await catalogService.getPlants();
        res.status(200).json({ message: "Plants retrieved successfully", data: plants });
    } catch (error) {
        next(error);
    }
};

export const getPlantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plant = await catalogService.getPlantById(req.params.id as string);
        res.status(200).json({ message: "Plant retrieved successfully", data: plant });
    } catch (error) {
        next(error);
    }
};
