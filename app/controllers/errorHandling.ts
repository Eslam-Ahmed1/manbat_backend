import { appError } from "../../utils/appErrors.ts"
import express from 'express'
import { detectError } from "../services/detectError.ts";
const errorHandling = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    err=detectError(err);
    console.error("Error log", err.stack)
    if (err instanceof appError)
        return res.status(err.statusCode).json({ message: err.message })
    //unexpected error
    return res.status(500).json({ message: "Internal Server Error" })
}
export { errorHandling }