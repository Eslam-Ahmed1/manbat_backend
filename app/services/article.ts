import Article from "../models/articles.js";
import { appError } from "../../utils/appErrors.js";

const buildPublicArticleQuery = (query: any) => {
    const dbQuery: any = { status: 'published' };

    if (query.search) {
        dbQuery.$or = [
            { title: { $regex: query.search, $options: 'i' } },
            { summary: { $regex: query.search, $options: 'i' } },
            { content: { $regex: query.search, $options: 'i' } }
        ];
    }

    if (query.tag) {
        dbQuery.tags = { $in: [query.tag] };
    }

    if (query.plantId) {
        dbQuery.plant_id = query.plantId;
    }

    if (query.type === 'general') {
        dbQuery.plant_id = null;
    }

    return dbQuery;
};

export const getArticles = async (query: any) => {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const dbQuery = buildPublicArticleQuery(query);

    const articles = await Article.find(dbQuery)
        .populate('plant_id', 'name image_url')
        .sort({ published_at: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Article.countDocuments(dbQuery);

    return {
        articles,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalArticles: total
    };
};

export const getArticleById = async (articleId: string) => {
    const article = await Article.findOne({ _id: articleId, status: 'published' })
        .populate('plant_id', 'name image_url');
    if (!article) throw new appError("Article not found", 404);
    return article;
};

export const getGeneralArticles = async (query: any) => {
    return await getArticles({ ...query, type: 'general' });
};

export const getPlantArticles = async (plantId: string, query: any) => {
    return await getArticles({ ...query, plantId });
};
