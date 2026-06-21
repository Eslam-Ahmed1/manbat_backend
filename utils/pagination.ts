import { Model } from 'mongoose';

interface PaginationOptions {
    page?: number | string;
    limit?: number | string;
    populate?: any;
    sort?: any;
    select?: any;
    lean?: boolean;
}

interface PaginationResult<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

/**
 * A highly reusable, generic Mongoose pagination service.
 * Supports sorting, field selection, populating related documents, and lean queries.
 */
export const paginate = async <T>(
    model: Model<any>,
    dbQuery: Record<string, any>,
    options: PaginationOptions = {}
): Promise<PaginationResult<T>> => {
    const page = parseInt(options.page as string) || 1;
    const limit = parseInt(options.limit as string) || 10;
    const skip = (page - 1) * limit;

    let queryExec = model.find(dbQuery).skip(skip).limit(limit);

    if (options.sort) {
        queryExec = queryExec.sort(options.sort);
    }

    if (options.select) {
        queryExec = queryExec.select(options.select);
    }

    if (options.populate) {
        queryExec = queryExec.populate(options.populate);
    }

    if (options.lean !== false) {
        queryExec = queryExec.lean();
    }

    const [data, totalItems] = await Promise.all([
        queryExec.exec(),
        model.countDocuments(dbQuery)
    ]);

    return {
        data,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems
    };
};
