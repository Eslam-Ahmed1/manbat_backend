import { type Request, type Response, type NextFunction } from 'express';
import * as articleService from '../services/article.ts';

export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await articleService.getArticles(req.query);
        res.status(200).json({ message: "Articles retrieved successfully", data: result });
    } catch (error) {
        next(error);
    }
};

export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const article = await articleService.getArticleById(req.params.id as string);
        res.status(200).json({ message: "Article retrieved successfully", data: article });
    } catch (error) {
        next(error);
    }
};

export const getGeneralArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await articleService.getGeneralArticles(req.query);
        res.status(200).json({ message: "General articles retrieved successfully", data: result });
    } catch (error) {
        next(error);
    }
};

export const getPlantArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await articleService.getPlantArticles(req.params.plantId as string, req.query);
        res.status(200).json({ message: "Plant articles retrieved successfully", data: result });
    } catch (error) {
        next(error);
    }
};
