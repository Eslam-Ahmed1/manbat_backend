function validate(schemas) {
    return (req, res, next) => {
        try {
            if (schemas.paramsSchema)
                req.params = schemas.paramsSchema.parse(req.params);
            if (schemas.bodySchema)
                req.body = schemas.bodySchema.parse(req.body);
            if (schemas.querySchema)
                req.query = schemas.querySchema.parse(req.query);
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const parsedData = schema.parse({
                params: req.params,
                body: req.body,
                query: req.query
            });
            if (parsedData.params)
                req.params = parsedData.params;
            if (parsedData.body)
                req.body = parsedData.body;
            if (parsedData.query)
                req.query = parsedData.query;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
export default validate;
