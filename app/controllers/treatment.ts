import { type Request,type  Response, type NextFunction } from 'express';
import * as treatmentService from '../services/treatment.ts';
import { appError } from '../../utils/appErrors.ts';

export const getAllTreatments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const treatments = await treatmentService.getAllTreatments();
        res.status(200).json({ message: "Treatments retrieved successfully", data: treatments });
    } catch (error) {
        next(error);
    }
};

export const getTreatmentsByDiseaseId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const treatments = await treatmentService.getTreatmentsByDiseaseId(req.params.diseaseId as string);
        res.status(200).json({ message: "Treatments retrieved successfully", data: treatments });
    } catch (error) {
        next(error);
    }
};

export const getTreatmentsByDiseaseIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { disease_ids } = req.body;
        if (!disease_ids || !Array.isArray(disease_ids)) {
            throw new appError("Please provide an array of disease_ids in the request body", 400);
        }
        const treatments = await treatmentService.getTreatmentsByDiseaseIds(disease_ids);
        res.status(200).json({ message: "Treatments retrieved successfully", data: treatments });
    } catch (error) {
        next(error);
    }
};

export const getTreatmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const treatment = await treatmentService.getTreatmentById(req.params.id as string);
        res.status(200).json({ message: "Treatment retrieved successfully", data: treatment });
    } catch (error) {
        next(error);
    }
};
