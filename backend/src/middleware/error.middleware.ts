import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error('Error occurred:', error);

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            error: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        });
        return;
    }

    res.status(500).json({
        success: false,
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};