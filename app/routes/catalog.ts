import express, { type RequestHandler } from 'express';
import * as catalogController from '../controllers/catalog.js';

const router = express.Router();

// Public read-only catalog routes

//get all category 
router.get('/categories', catalogController.getCategories as RequestHandler);
//get plants by categoryID
router.get('/categories/:id/plants', catalogController.getPlantsByCategory as RequestHandler);
// get all palnts with category details
router.get('/plants', catalogController.getPlants as RequestHandler);
// get plant by id
router.get('/plants/:id', catalogController.getPlantById as RequestHandler);

export default router;
