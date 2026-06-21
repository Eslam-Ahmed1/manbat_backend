import * as articleService from '../services/article.js';
export const getArticles = async (req, res, next) => {
    try {
        const result = await articleService.getArticles(req.query);
        res.status(200).json({ message: "Articles retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
export const getArticleById = async (req, res, next) => {
    try {
        const article = await articleService.getArticleById(req.params.id);
        res.status(200).json({ message: "Article retrieved successfully", data: article });
    }
    catch (error) {
        next(error);
    }
};
export const getGeneralArticles = async (req, res, next) => {
    try {
        const result = await articleService.getGeneralArticles(req.query);
        res.status(200).json({ message: "General articles retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
export const getPlantArticles = async (req, res, next) => {
    try {
        const result = await articleService.getPlantArticles(req.params.plantId, req.query);
        res.status(200).json({ message: "Plant articles retrieved successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
