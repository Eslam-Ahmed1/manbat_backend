class appError extends Error {
    isOperational: boolean;
    statusCode: number;
    constructor(message: string | undefined, statusCode: number = 500) {
        super(message)
        this.message = this.message || 'Internal Server Error'
        this.statusCode = statusCode
        this.isOperational = true; //this mean error cross over here and expected 
        Error.captureStackTrace(this)//asign stack to help in debuging 
    }
}
export { appError };
