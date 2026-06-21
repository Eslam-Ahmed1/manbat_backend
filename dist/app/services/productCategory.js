import ProductCategory from "../models/productCategory.js";
import { appError } from "../../utils/appErrors.js";
export const getAllCategories = async () => {
    return await ProductCategory.find().sort({ name: 1 });
};
export const getCategoryById = async (id) => {
    const category = await ProductCategory.findById(id);
    if (!category)
        throw new appError("Product Category not found", 404);
    return category;
};
export const createCategory = async (data) => {
    const existing = await ProductCategory.findOne({ name: data.name });
    if (existing)
        throw new appError("Category with this name already exists", 400);
    const category = new ProductCategory(data);
    return await category.save();
};
export const updateCategory = async (id, data) => {
    if (data.name) {
        const existing = await ProductCategory.findOne({ name: data.name, _id: { $ne: id } });
        if (existing)
            throw new appError("Category with this name already exists", 400);
    }
    const category = await ProductCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!category)
        throw new appError("Product Category not found", 404);
    return category;
};
export const deleteCategory = async (id) => {
    const category = await ProductCategory.findByIdAndDelete(id);
    if (!category)
        throw new appError("Product Category not found", 404);
    return category;
};
