import express from 'express';
import * as articleController from '../controllers/article.js';
const router = express.Router();
router.get('/', articleController.getArticles);
router.get('/general', articleController.getGeneralArticles);
router.get('/plants/:plantId', articleController.getPlantArticles);
router.get('/:id', articleController.getArticleById);
export default router;
