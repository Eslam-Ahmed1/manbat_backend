import express from 'express';
import * as adminController from '../controllers/admin.js';
import * as configController from '../controllers/config.js';
import * as scanModelSettingsController from '../controllers/scanModelSettings.js';
import Authorization from '../middlewares/authMiddleware.js';
import AdminAuthorization from '../middlewares/adminMiddleware.js';
import multer from 'multer';
import { validateRequest } from '../middlewares/validationRequestMiddleware.js';
import * as adminSchemas from '../schemas/admin.js';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// ALL routes in this file are protected and require ADMIN privileges
router.use(Authorization, AdminAuthorization);
// Dashboard & Analytics
router.get('/stats', adminController.getDashboardStats);
router.get('/analytics', adminController.getAdvancedAnalytics);
router.get('/revenue', validateRequest(adminSchemas.revenueQuerySchema), adminController.getRevenueByPeriod);
// Product Management
router.post('/product', upload.single('productImage'), validateRequest(adminSchemas.createProductSchema), adminController.createProduct);
router.put('/product/:id', upload.single('productImage'), validateRequest(adminSchemas.updateProductSchema), adminController.updateProduct);
router.delete('/product/:id', adminController.deleteProduct);
// Order Management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', validateRequest(adminSchemas.updateOrderStatusSchema), adminController.updateOrderStatus);
// User Management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', validateRequest(adminSchemas.updateUserRoleSchema), adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
// Disease Management
router.get('/diseases', adminController.getAllDiseases);
router.post('/diseases', validateRequest(adminSchemas.createDiseaseSchema), adminController.createDisease);
router.put('/diseases/:id', validateRequest(adminSchemas.updateDiseaseSchema), adminController.updateDisease);
router.delete('/diseases/:id', adminController.deleteDisease);
// Treatment Management
router.get('/treatments', adminController.getAllTreatments);
router.post('/treatments', validateRequest(adminSchemas.createTreatmentSchema), adminController.createTreatment);
router.put('/treatments/:id', validateRequest(adminSchemas.updateTreatmentSchema), adminController.updateTreatment);
router.delete('/treatments/:id', adminController.deleteTreatment);
// Category Management
router.get('/categories', adminController.getAllCategories);
router.post('/categories', validateRequest(adminSchemas.createCategorySchema), adminController.createCategory);
router.put('/categories/:id', validateRequest(adminSchemas.updateCategorySchema), adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);
// Product Category Management
router.get('/product-categories', adminController.getAllProductCategories);
router.post('/product-categories', validateRequest(adminSchemas.createProductCategorySchema), adminController.createProductCategory);
router.put('/product-categories/:id', validateRequest(adminSchemas.updateProductCategorySchema), adminController.updateProductCategory);
router.delete('/product-categories/:id', adminController.deleteProductCategory);
// Plant Management
router.get('/plants', adminController.getAllPlants);
router.post('/plants', upload.single('plantImage'), validateRequest(adminSchemas.createPlantSchema), adminController.createPlant);
router.put('/plants/:id', upload.single('plantImage'), validateRequest(adminSchemas.updatePlantSchema), adminController.updatePlant);
router.delete('/plants/:id', adminController.deletePlant);
// Article Management
router.get('/articles', adminController.getAllArticles);
router.post('/articles', upload.single('articleImage'), validateRequest(adminSchemas.createArticleSchema), adminController.createArticle);
router.get('/articles/:id', adminController.getArticleById);
router.put('/articles/:id', upload.single('articleImage'), validateRequest(adminSchemas.updateArticleSchema), adminController.updateArticle);
router.delete('/articles/:id', adminController.deleteArticle);
// Plant Scan Management
router.get('/scans', adminController.getAllScans);
router.get('/scans/:id', adminController.getScanById);
router.delete('/scans/:id', adminController.deleteScan);
// AI Scan Statistics
router.get('/ai-stats', adminController.getAIScanStats);
// Database Seeding
router.post('/seed-database', adminController.seedDatabase);
// Remote Config Management
router.get('/config', configController.getAll);
router.post('/config', configController.set);
router.delete('/config/:key', configController.remove);
// Scan detection: Gemini / HF model / hybrid
router.get('/scan-detection', scanModelSettingsController.getSettings);
router.put('/scan-detection', validateRequest(adminSchemas.updateScanDetectionSettingsSchema), scanModelSettingsController.updateSettings);
export default router;
