import { appError } from "../../utils/appErrors.ts"
import express from 'express'
import { detectError } from "../services/detectError.ts";
import { logError } from "../../utils/errorLogger.ts";

const errorHandling = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    err = detectError(err);

    // Log to file with request context
    logError(err, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: (req as any).user?._id?.toString(),
        body: req.body
    });

    if (err instanceof appError)
        return res.status(err.statusCode).json({ message: err.message });

    // Unexpected error — hide details from client
    return res.status(500).json({ message: "Internal Server Error" });
}
export { errorHandling }