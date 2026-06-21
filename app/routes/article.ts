import express, { type RequestHandler } from 'express';
import * as articleController from '../controllers/article.js';

const router = express.Router();

router.get('/', articleController.getArticles as RequestHandler);
router.get('/general', articleController.getGeneralArticles as RequestHandler);
router.get('/plants/:plantId', articleController.getPlantArticles as RequestHandler);
router.get('/:id', articleController.getArticleById as RequestHandler);

export default router;
