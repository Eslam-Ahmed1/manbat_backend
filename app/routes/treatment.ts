import express, { type RequestHandler } from 'express';
import * as treatmentController from '../controllers/treatment.js';

const router = express.Router();

// Public read-only treatment routes
router.get('/', treatmentController.getAllTreatments as RequestHandler);
router.get('/:id', treatmentController.getTreatmentById as RequestHandler);
// Route to get treatments for multiple diseases at once
router.post('/diseases', treatmentController.getTreatmentsByDiseaseIds as RequestHandler);

router.get('/disease/:diseaseId', treatmentController.getTreatmentsByDiseaseId as RequestHandler);

export default router;
