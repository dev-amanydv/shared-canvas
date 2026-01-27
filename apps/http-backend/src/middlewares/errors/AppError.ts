export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;
    public readonly timestamp: string;

    constructor ( 
        message: string,
        statusCode: number,
        isOperational: boolean = true,
        details?: any
    ) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = true;
        this.details = details;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }
}