// we need create validate by using zod 
import z, { ZodType } from 'zod'
import * as express from 'express'
import { fromError, fromZodError, isZodErrorLike } from 'zod-validation-error';
import { appError } from '../../utils/appErrors.ts';

//zodType<T> validate that only schema type accepted in function
interface schemas<P, B, Q> {
    paramsSchema?: ZodType<P>,
    bodySchema?: ZodType<B>,
    querySchema?: ZodType<Q>
}
function validate<P, B, Q>(schemas: schemas<P, B, Q>) {
    return (req: express.Request<P, object, B, Q>, res: express.Response, next: express.NextFunction) => {
        try {
            if (schemas.paramsSchema)
                req.params = schemas.paramsSchema.parse(req.params)
            if (schemas.bodySchema)
                req.body = schemas.bodySchema.parse(req.body)
            if (schemas.querySchema)
                req.query = schemas.querySchema.parse(req.query)
            next();
        }
        catch (err) {
            next(err)
        }
    }
}

export default validate;