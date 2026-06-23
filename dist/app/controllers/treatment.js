import * as treatmentService from '../services/treatment.js';
import { appError } from '../../utils/appErrors.js';
export const getAllTreatments = async (req, res, next) => {
    try {
        const treatments = await treatmentService.getAllTreatments();
        res.status(200).json({ message: "Treatments retrieved successfully", data: treatments });
    }
    catch (error) {
        next(error);
    }
};
export const getTreatmentsByDiseaseId = async (req, res, next) => {
    try {
        const treatments = await treatmentService.getTreatmentsByDiseaseId(req.params.diseaseId);
        res.status(200).json({ message: "Treatments retrieved successfully", data: treatments });
    }
    catch (error) {
        next(error);
    }
};
export const getTreatmentsByDiseaseIds = async (req, res, next) => {
    try {
        const { disease_ids } = req.body;
        if (!disease_ids || !Array.isArray(disease_ids)) {
            throw new appError("Please provide an array of disease_ids in the request body", 400);
        }
        const treatments = await treatmentService.getTreatmentsByDiseaseIds(disease_ids);
        res.status(200).json({ message: "Treatments retrieved successfully", data: treatments });
    }
    catch (error) {
        next(error);
    }
};
export const getTreatmentById = async (req, res, next) => {
    try {
        const treatment = await treatmentService.getTreatmentById(req.params.id);
        res.status(200).json({ message: "Treatment retrieved successfully", data: treatment });
    }
    catch (error) {
        next(error);
    }
};
