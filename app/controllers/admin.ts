import { type Request, type Response, type NextFunction } from 'express';
import * as adminService from '../services/admin.ts';
import { appError } from '../../utils/appErrors.ts';
import * as productCategoryService from '../services/productCategory.ts';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.file)
           throw new appError('please upload product image',400);
        const imageBuffer=req.file.buffer
        const product = await adminService.createProduct(imageBuffer,req.body);
        res.status(201).json({ message: "Product created successfully", data: product });
    } catch (error) { next(error); }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imageBuffer = req.file ? req.file.buffer : undefined;
        const product = await adminService.updateProduct(req.params.id as string, imageBuffer, req.body);
        res.status(200).json({ message: "Product updated successfully", data: product });
    } catch (error) { next(error); }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await adminService.deleteProduct(req.params.id as string);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) { next(error); }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await adminService.getAllOrders(req.query);
        res.status(200).json({ message: "Orders retrieved successfully", data: orders });
    } catch (error) { next(error); }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body;
        if (!status) throw new appError("Status is required", 400);

        const order = await adminService.updateOrderStatus(req.params.id as string, status);
        res.status(200).json({ message: "Order status updated", data: order });
    } catch (error) { next(error); }
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json({ message: "Dashboard stats retrieved", data: stats });
    } catch (error) { next(error); }
};

// --- USER MANAGEMENT ---
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await adminService.getAllUsers(req.query);
        res.status(200).json({ message: "Users retrieved successfully", data: users });
    } catch (error) { next(error); }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.body;
        if (!role) throw new appError("Role is required", 400);
        
        const user = await adminService.updateUserRole(req.params.id as string, role);
        res.status(200).json({ message: "User role updated", data: user });
    } catch (error) { next(error); }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await adminService.deleteUser(req.params.id as string);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) { next(error); }
};

// --- DISEASE MANAGEMENT ---
export const createDisease = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const disease = await adminService.createDisease(req.body);
        res.status(201).json({ message: "Disease created successfully", data: disease });
    } catch (error) { next(error); }
};

export const updateDisease = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const disease = await adminService.updateDisease(req.params.id as string, req.body);
        res.status(200).json({ message: "Disease updated successfully", data: disease });
    } catch (error) { next(error); }
};

export const deleteDisease = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await adminService.deleteDisease(req.params.id as string);
        res.status(200).json({ message: "Disease deleted successfully" });
    } catch (error) { next(error); }
};

export const getAllDiseases = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const diseases = await adminService.getAllDiseases(req.query);
        res.status(200).json({ message: "Diseases retrieved successfully", data: diseases });
    } catch (error) { next(error); }
};

// --- TREATMENT MANAGEMENT ---
export const createTreatment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const treatment = await adminService.createTreatment(req.body);
        res.status(201).json({ message: "Treatment created successfully", data: treatment });
    } catch (error) { next(error); }
};

export const updateTreatment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const treatment = await adminService.updateTreatment(req.params.id as string, req.body);
        res.status(200).json({ message: "Treatment updated successfully", data: treatment });
    } catch (error) { next(error); }
};

export const deleteTreatment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await adminService.deleteTreatment(req.params.id as string);
        res.status(200).json({ message: "Treatment deleted successfully" });
    } catch (error) { next(error); }
};

export const getAllTreatments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const treatments = await adminService.getAllTreatments(req.query);
        res.status(200).json({ message: "Treatments retrieved successfully", data: treatments });
    } catch (error) { next(error); }
};

// --- CATEGORY MANAGEMENT ---
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await adminService.createCategory(req.body);
        res.status(201).json({ message: "Category created successfully", data: category });
    } catch (error) { next(error); }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await adminService.updateCategory(req.params.id as string, req.body);
        res.status(200).json({ message: "Category updated successfully", data: category });
    } catch (error) { next(error); }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await adminService.deleteCategory(req.params.id as string);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) { next(error); }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await adminService.getAllCategories(req.query);
        res.status(200).json({ message: "Categories retrieved successfully", data: categories });
    } catch (error) { next(error); }
};

// --- PRODUCT CATEGORY MANAGEMENT ---
export const createProductCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await productCategoryService.createCategory(req.body);
        res.status(201).json({ message: "Product category created successfully", data: category });
    } catch (error) { next(error); }
};

export const updateProductCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await productCategoryService.updateCategory(req.params.id as string, req.body);
        res.status(200).json({ message: "Product category updated successfully", data: category });
    } catch (error) { next(error); }
};

export const deleteProductCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await productCategoryService.deleteCategory(req.params.id as string);
        res.status(200).json({ message: "Product category deleted successfully" });
    } catch (error) { next(error); }
};

export const getAllProductCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await productCategoryService.getAllCategories();
        res.status(200).json({ message: "Product categories retrieved successfully", data: categories });
    } catch (error) { next(error); }
};


// --- ADVANCED ANALYTICS ---
export const getAdvancedAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const analytics = await adminService.getAdvancedAnalytics();
        res.status(200).json({ message: "Analytics retrieved successfully", data: analytics });
    } catch (error) { next(error); }
};

export const getRevenueByPeriod = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate } = req.query;
        const revenue = await adminService.getRevenueByPeriod(
            startDate as string,
            endDate as string
        );
        res.status(200).json({ message: "Revenue data retrieved", data: revenue });
    } catch (error) { next(error); }
};

// --- PLANT MANAGEMENT ---
export const createPlant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) throw new appError('Please upload plant image', 400);
        const imageBuffer = req.file.buffer;
        const plant = await adminService.createPlant(imageBuffer, req.body);
        res.status(201).json({ message: "Plant created successfully", data: plant });
    } catch (error) { next(error); }
};

export const updatePlant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imageBuffer = req.file ? req.file.buffer : undefined;
        const plant = await adminService.updatePlant(req.params.id as string, imageBuffer, req.body);
        res.status(200).json({ message: "Plant updated successfully", data: plant });
    } catch (error) { next(error); }
};

export const deletePlant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await adminService.deletePlant(req.params.id as string);
        res.status(200).json({ message: "Plant deleted successfully" });
    } catch (error) { next(error); }
};

export const getAllPlants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plants = await adminService.getAllPlants(req.query);
        res.status(200).json({ message: "Plants retrieved successfully", data: plants });
    } catch (error) { next(error); }
};

// --- ARTICLE MANAGEMENT ---
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imageBuffer = req.file ? req.file.buffer : undefined;
        const article = await adminService.createArticle(imageBuffer, req.body);
        res.status(201).json({ message: "Article created successfully", data: article });
    } catch (error) { next(error); }
};

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imageBuffer = req.file ? req.file.buffer : undefined;
        const article = await adminService.updateArticle(req.params.id as string, imageBuffer, req.body);
        res.status(200).json({ message: "Article updated successfully", data: article });
    } catch (error) { next(error); }
};

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await adminService.deleteArticle(req.params.id as string);
        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) { next(error); }
};

export const getAllArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articles = await adminService.getAllArticles(req.query);
        res.status(200).json({ message: "Articles retrieved successfully", data: articles });
    } catch (error) { next(error); }
};

export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const article = await adminService.getArticleById(req.params.id as string);
        res.status(200).json({ message: "Article retrieved successfully", data: article });
    } catch (error) { next(error); }
};

// --- PLANT SCAN MANAGEMENT ---
export const getAllScans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scans = await adminService.getAllScans(req.query);
        res.status(200).json({ message: "Scans retrieved successfully", data: scans });
    } catch (error) { next(error); }
};

export const getScanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scan = await adminService.getScanById(req.params.id as string);
        res.status(200).json({ message: "Scan retrieved successfully", data: scan });
    } catch (error) { next(error); }
};

export const deleteScan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await adminService.deleteScan(req.params.id as string);
        res.status(200).json({ message: "Scan deleted successfully" });
    } catch (error) { next(error); }
};

// --- AI SCAN STATISTICS ---
export const getAIScanStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await adminService.getAIScanStats();
        res.status(200).json({ message: "AI scan statistics retrieved", data: stats });
    } catch (error) { next(error); }
};

// --- DATABASE SEEDING ---
export const seedDatabase = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await adminService.runDatabaseSeeds();
        if (result.success) {
            res.status(200).json({ message: result.message, logs: result.logs });
        } else {
            res.status(500).json({ message: result.message, error: result.error, logs: result.logs });
        }
    } catch (error) { next(error); }
};
