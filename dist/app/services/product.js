import Product from "../models/product.js";
import { paginate } from "../../utils/pagination.js";
import { appError } from "../../utils/appErrors.js";
export const getAllProducts = async (query) => {
    let dbQuery = {};
    // 1. Search (Name or Description)
    if (query.search) {
        dbQuery.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { description: { $regex: query.search, $options: 'i' } }
        ];
    }
    // 2. Category Filter
    if (query.category) {
        dbQuery.product_category_id = query.category;
    }
    // 3. Stock Filter (inStock=true)
    if (query.inStock === 'true') {
        dbQuery.quantity = { $gt: 0 };
    }
    // 4. Price Range Filter
    if (query.minPrice || query.maxPrice) {
        dbQuery.price = {};
        if (query.minPrice)
            dbQuery.price.$gte = Number(query.minPrice);
        if (query.maxPrice)
            dbQuery.price.$lte = Number(query.maxPrice);
    }
    // 5. Determine Sorting Option
    let sortOption = { createdAt: -1 }; // Default: Newest first
    if (query.sort) {
        switch (query.sort) {
            case 'price_asc':
                sortOption = { price: 1 };
                break;
            case 'price_desc':
                sortOption = { price: -1 };
                break;
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
        }
    }
    // 6. Execute Paginated Query
    const result = await paginate(Product, dbQuery, {
        page: query.page,
        limit: query.limit,
        populate: [
            { path: 'treatment_id', select: 'name instructions' },
            { path: 'product_category_id', select: 'name' }
        ],
        sort: sortOption
    });
    return {
        products: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalProducts: result.totalItems
    };
};
export const getProductById = async (id) => {
    const product = await Product.findById(id)
        .populate({ path: 'treatment_id', select: 'name instructions' })
        .populate({ path: 'product_category_id', select: 'name' });
    if (!product)
        throw new appError("Product not found", 404);
    return product;
};
export const getRelatedProducts = async (id, limit = 4) => {
    const product = await Product.findById(id);
    if (!product)
        throw new appError("Product not found", 404);
    // Find products in same category, excluding the current product
    const related = await Product.find({
        _id: { $ne: id },
        product_category_id: product.product_category_id
    })
        .limit(limit)
        .populate({ path: 'product_category_id', select: 'name' });
    return related;
};
export const getFeaturedProducts = async (limit = 6) => {
    // Get high-discount or recent products
    return await Product.find()
        .limit(limit)
        .populate({ path: 'product_category_id', select: 'name' })
        .sort({ discount: -1, createdAt: -1 });
};
