import { AppError } from "./AppError.js";

export class BadRequestError extends AppError {
    constructor(
        message: string = 'Bad Request',
        details?: any
    ){
        super(message, 400, true, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor (
        message: string = 'Unauthorized',
        details?: any
    ){
        super(message, 401, true, details);
    }
}

export class ForbiddenError extends AppError {
    constructor(
        message: string = 'Forbidden',
        details?: any
    ){
        super(message, 402, true, details)
    }
}

export class NotFoundError extends AppError {
    constructor(
        message: string = 'Resource not found',
        details?: any
    ){
        super(message, 403, true, details)
    }
}

export class ConflictError extends AppError {
    constructor(
        message: string,
        details?: any
    ){
        super(message, 409, true, details)
    }
}

export class ValidationError extends AppError {
    constructor(
        message: string,
        details?: any
    ){
        super(message, 422, true, details);
    }
}

export class InternalServerError extends AppError {
    constructor(
        message: string = 'Internal server error',
        isOperational: boolean = false,
    ){
        super(message, 500, isOperational);
    }
}
