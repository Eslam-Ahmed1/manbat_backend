import * as plantService from '../services/plant.js';
export const getPlants = async (req, res, next) => {
    try {
        const result = await plantService.getPlants(req.query);
        res.status(200).json({ message: "Plants retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
export const getPlantById = async (req, res, next) => {
    try {
        const plant = await plantService.getPlantById(req.params.id);
        res.status(200).json({ message: "Plant retrieved successfully", data: plant });
    }
    catch (error) {
        next(error);
    }
};
