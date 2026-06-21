import Category from "../models/categories.js";
import Plant from "../models/Plants.js";
import { appError } from "../../utils/appErrors.js";

export const getCategories = async () => {
    return await Category.find();
};

export const getPlantsByCategory = async (categoryId: string) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new appError("Category not found", 404);
    }
    return await Plant.find({ category_id: categoryId });
};

export const getPlants = async () => {
    return await Plant.find().populate('category_id', 'name');
};

export const getPlantById = async (plantId: string) => {
    const plant = await Plant.findById(plantId).populate('category_id', 'name');
    if (!plant) throw new appError("Plant not found", 404);
    return plant;
};
