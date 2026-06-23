import Plant from "../models/Plants.js";
import Category from "../models/categories.js";
import { appError } from "../../utils/appErrors.js";
import { paginate } from "../../utils/pagination.js";

const buildPublicPlantQuery = async (query: any) => {
    const dbQuery: any = {};

    if (query.search) {
        dbQuery.name = { $regex: query.search, $options: 'i' };
    }

    if (query.category) {
        // Can filter by category ID or category name
        const isObjectId = typeof query.category === 'string' && /^[0-9a-fA-F]{24}$/.test(query.category);
        const category = await Category.findOne(
            isObjectId
                ? { _id: query.category }
                : { name: { $regex: String(query.category), $options: 'i' } }
        );

        if (category) {
            dbQuery.category_id = category._id;
        } else {
            // If category specified but not found, force query to return no results
            dbQuery.category_id = "000000000000000000000000";
        }
    }

    return dbQuery;
};

export const getPlants = async (query: any) => {
    const dbQuery = await buildPublicPlantQuery(query);

    const result = await paginate<any>(Plant, dbQuery, {
        page: query.page,
        limit: query.limit,
        populate: { path: 'category_id', select: 'name' },
        sort: { name: 1 }
    });

    return {
        plants: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalPlants: result.totalItems
    };
};

export const getPlantById = async (plantId: string) => {
    const plant = await Plant.findById(plantId).populate('category_id', 'name');
    if (!plant) throw new appError("Plant not found", 404);
    return plant;
};
