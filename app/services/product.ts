import Product from "../models/product.ts";

export const getAllProducts = async (query: any) => {
    // 1. Pagination settings (Default: page 1, 10 items per page)
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit; // Math to figure out how many items to skip

    // 2. Building the Database Query object
    let dbQuery: any = {};

    // Search: If user typed "?search=neem", look for "neem" in the product name
    if (query.search) {
        dbQuery.name = { $regex: query.search, $options: 'i' }; // 'i' makes it case-insensitive
    }

    // Filtering: If user typed "?minPrice=10&maxPrice=50"
    if (query.minPrice || query.maxPrice) {
        dbQuery.price = {};
        if (query.minPrice) dbQuery.price.$gte = Number(query.minPrice); // Greater than or equal
        if (query.maxPrice) dbQuery.price.$lte = Number(query.maxPrice); // Less than or equal
    }

    // 3. Execute the query with the limit and skip applied
    const products = await Product.find(dbQuery)
        .skip(skip)
        .limit(limit)
        .populate('treatment_id', 'name'); // Get the treatment name instead of just the ID

    // 4. Count the total matching documents so the frontend knows how many pages exist
    const total = await Product.countDocuments(dbQuery);

    return {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total
    };
};