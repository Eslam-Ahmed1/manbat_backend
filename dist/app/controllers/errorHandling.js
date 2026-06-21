import { appError } from "../../utils/appErrors.js";
import { detectError } from "../services/detectError.js";
import { logError } from "../../utils/errorLogger.js";
const errorHandling = (err, req, res, next) => {
    err = detectError(err);
    // Log to file with request context
    logError(err, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user?._id?.toString(),
        body: req.body
    });
    if (err instanceof appError)
        return res.status(err.statusCode).json({ message: err.message });
    // Unexpected error — hide details from client
    return res.status(500).json({ message: "Internal Server Error" });
};
export { errorHandling };
