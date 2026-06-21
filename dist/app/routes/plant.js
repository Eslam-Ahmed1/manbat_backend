import express from 'express';
import * as plantController from '../controllers/plant.js';
const router = express.Router();
router.get('/', plantController.getPlants);
router.get('/:id', plantController.getPlantById);
export default router;
