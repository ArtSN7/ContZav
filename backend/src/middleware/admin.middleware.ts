import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError.js';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user?.is_admin) {
        throw new AppError('Admin access required', 403);
    }
    next();
};