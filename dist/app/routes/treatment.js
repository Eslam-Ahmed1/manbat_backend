import express from 'express';
import * as treatmentController from '../controllers/treatment.js';
const router = express.Router();
// Public read-only treatment routes
router.get('/', treatmentController.getAllTreatments);
router.get('/:id', treatmentController.getTreatmentById);
// Route to get treatments for multiple diseases at once
router.post('/diseases', treatmentController.getTreatmentsByDiseaseIds);
router.get('/disease/:diseaseId', treatmentController.getTreatmentsByDiseaseId);
export default router;
