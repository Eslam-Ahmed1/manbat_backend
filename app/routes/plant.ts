import express, { type RequestHandler } from 'express';
import * as plantController from '../controllers/plant.js';

const router = express.Router();

router.get('/', plantController.getPlants as RequestHandler);
router.get('/:id', plantController.getPlantById as RequestHandler);

export default router;
