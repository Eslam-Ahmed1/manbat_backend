import Treatment from "../models/treatments.ts";
import Disease from "../models/diseases.ts";
import { appError } from "../../utils/appErrors.ts";
import mongose from "mongoose";

export const getAllTreatments = async () => {
    return await Treatment.find().populate('disease_ids', 'name');
};

export const getTreatmentsByDiseaseId = async (diseaseId: string) => {
    const disease = await Disease.findById(diseaseId);
    if (!disease) throw new appError("Disease not found", 404);
    
    return await Treatment.find({ disease_ids: diseaseId });
};

export const getTreatmentsByDiseaseIds = async (diseaseIds: string[]) => {
    // Finds all treatments where the 'disease_ids' array contains AT LEAST ONE of the provided IDs
    console.log(await Treatment.find({disease_ids:{ $in:[ new mongose.Types.ObjectId('69e5122cf22bd8d67d14775a')]}}));
    const objectIds = diseaseIds.map(id => new mongose.Types.ObjectId(id));
    return await Treatment.find({ disease_ids: { $in:objectIds} }).populate('disease_ids', 'name');
};

export const getTreatmentById = async (id: string) => {
    const treatment = await Treatment.findById(id).populate('disease_ids', 'name description');
    if (!treatment) throw new appError("Treatment not found", 404);
    return treatment;
};
