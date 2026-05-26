import express, { type RequestHandler } from 'express';
import * as adminController from '../controllers/admin.ts';
import * as configController from '../controllers/config.ts';
import * as scanModelSettingsController from '../controllers/scanModelSettings.ts';
import Authorization from '../middlewares/authMiddleware.ts';
import AdminAuthorization from '../middlewares/adminMiddleware.ts';
import multer, { memoryStorage } from 'multer';
import { validateRequest } from '../middlewares/validationRequestMiddleware.ts';
import * as adminSchemas from '../schemas/admin.ts';

const router = express.Router();
const upload=multer({storage:multer.memoryStorage()})

// ALL routes in this file are protected and require ADMIN privileges
router.use(Authorization as RequestHandler, AdminAuthorization as RequestHandler);

// Dashboard & Analytics
router.get('/stats', adminController.getDashboardStats as RequestHandler);
router.get('/analytics', adminController.getAdvancedAnalytics as RequestHandler);
router.get('/revenue', 
    validateRequest(adminSchemas.revenueQuerySchema) as RequestHandler,
    adminController.getRevenueByPeriod as RequestHandler
);

// Product Management
router.post('/product',
    upload.single('productImage'),
    validateRequest(adminSchemas.createProductSchema) as RequestHandler,
    adminController.createProduct as RequestHandler
);
router.put('/product/:id', 
    upload.single('productImage'),
    validateRequest(adminSchemas.updateProductSchema) as RequestHandler,
    adminController.updateProduct as RequestHandler
);
router.delete('/product/:id', adminController.deleteProduct as RequestHandler);

// Order Management
router.get('/orders', adminController.getAllOrders as RequestHandler);
router.put('/orders/:id/status',
    validateRequest(adminSchemas.updateOrderStatusSchema) as RequestHandler,
    adminController.updateOrderStatus as RequestHandler
);

// User Management
router.get('/users', adminController.getAllUsers as RequestHandler);
router.put('/users/:id/role',
    validateRequest(adminSchemas.updateUserRoleSchema) as RequestHandler,
    adminController.updateUserRole as RequestHandler
);
router.delete('/users/:id', adminController.deleteUser as RequestHandler);

// Disease Management
router.get('/diseases', adminController.getAllDiseases as RequestHandler);
router.post('/diseases',
    validateRequest(adminSchemas.createDiseaseSchema) as RequestHandler,
    adminController.createDisease as RequestHandler
);
router.put('/diseases/:id',
    validateRequest(adminSchemas.updateDiseaseSchema) as RequestHandler,
    adminController.updateDisease as RequestHandler
);
router.delete('/diseases/:id', adminController.deleteDisease as RequestHandler);

// Treatment Management
router.get('/treatments', adminController.getAllTreatments as RequestHandler);
router.post('/treatments',
    validateRequest(adminSchemas.createTreatmentSchema) as RequestHandler,
    adminController.createTreatment as RequestHandler
);
router.put('/treatments/:id',
    validateRequest(adminSchemas.updateTreatmentSchema) as RequestHandler,
    adminController.updateTreatment as RequestHandler
);
router.delete('/treatments/:id', adminController.deleteTreatment as RequestHandler);

// Category Management
router.get('/categories', adminController.getAllCategories as RequestHandler);
router.post('/categories',
    validateRequest(adminSchemas.createCategorySchema) as RequestHandler,
    adminController.createCategory as RequestHandler
);
router.put('/categories/:id',
    validateRequest(adminSchemas.updateCategorySchema) as RequestHandler,
    adminController.updateCategory as RequestHandler
);
router.delete('/categories/:id', adminController.deleteCategory as RequestHandler);

// Product Category Management
router.get('/product-categories', adminController.getAllProductCategories as RequestHandler);
router.post('/product-categories',
    validateRequest(adminSchemas.createProductCategorySchema) as RequestHandler,
    adminController.createProductCategory as RequestHandler
);
router.put('/product-categories/:id',
    validateRequest(adminSchemas.updateProductCategorySchema) as RequestHandler,
    adminController.updateProductCategory as RequestHandler
);
router.delete('/product-categories/:id', adminController.deleteProductCategory as RequestHandler);

// Plant Management
router.get('/plants', adminController.getAllPlants as RequestHandler);
router.post('/plants',
    upload.single('plantImage'),
    validateRequest(adminSchemas.createPlantSchema) as RequestHandler,
    adminController.createPlant as RequestHandler
);
router.put('/plants/:id',
    upload.single('plantImage'),
    validateRequest(adminSchemas.updatePlantSchema) as RequestHandler,
    adminController.updatePlant as RequestHandler
);
router.delete('/plants/:id', adminController.deletePlant as RequestHandler);

// Article Management
router.get('/articles', adminController.getAllArticles as RequestHandler);
router.post('/articles',
    upload.single('articleImage'),
    validateRequest(adminSchemas.createArticleSchema) as RequestHandler,
    adminController.createArticle as RequestHandler
);
router.get('/articles/:id', adminController.getArticleById as RequestHandler);
router.put('/articles/:id',
    upload.single('articleImage'),
    validateRequest(adminSchemas.updateArticleSchema) as RequestHandler,
    adminController.updateArticle as RequestHandler
);
router.delete('/articles/:id', adminController.deleteArticle as RequestHandler);

// Plant Scan Management
router.get('/scans', adminController.getAllScans as RequestHandler);
router.get('/scans/:id', adminController.getScanById as RequestHandler);
router.delete('/scans/:id', adminController.deleteScan as RequestHandler);

// AI Scan Statistics
router.get('/ai-stats', adminController.getAIScanStats as RequestHandler);

// Database Seeding
router.post('/seed-database', adminController.seedDatabase as RequestHandler);

// Remote Config Management
router.get('/config', configController.getAll as RequestHandler);
router.post('/config', configController.set as RequestHandler);
router.delete('/config/:key', configController.remove as RequestHandler);

// Scan detection: Gemini / HF model / hybrid
router.get(
    '/scan-detection',
    scanModelSettingsController.getSettings as RequestHandler,
);
router.put(
    '/scan-detection',
    validateRequest(adminSchemas.updateScanDetectionSettingsSchema) as RequestHandler,
    scanModelSettingsController.updateSettings as RequestHandler,
);

export default router;
