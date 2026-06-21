import * as catalogService from '../services/catalog.js';
export const getCategories = async (req, res, next) => {
    try {
        const categories = await catalogService.getCategories();
        res.status(200).json({ message: "Categories retrieved successfully", data: categories });
    }
    catch (error) {
        next(error);
    }
};
export const getPlantsByCategory = async (req, res, next) => {
    try {
        const plants = await catalogService.getPlantsByCategory(req.params.id);
        res.status(200).json({ message: "Plants retrieved successfully", data: plants });
    }
    catch (error) {
        next(error);
    }
};
export const getPlants = async (req, res, next) => {
    try {
        const plants = await catalogService.getPlants();
        res.status(200).json({ message: "Plants retrieved successfully", data: plants });
    }
    catch (error) {
        next(error);
    }
};
export const getPlantById = async (req, res, next) => {
    try {
        const plant = await catalogService.getPlantById(req.params.id);
        res.status(200).json({ message: "Plant retrieved successfully", data: plant });
    }
    catch (error) {
        next(error);
    }
};
