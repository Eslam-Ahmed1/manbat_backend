import express from 'express';
import * as catalogController from '../controllers/catalog.js';
const router = express.Router();
// Public read-only catalog routes
//get all category 
router.get('/categories', catalogController.getCategories);
//get plants by categoryID
router.get('/categories/:id/plants', catalogController.getPlantsByCategory);
// get all palnts with category details
router.get('/plants', catalogController.getPlants);
// get plant by id
router.get('/plants/:id', catalogController.getPlantById);
export default router;
