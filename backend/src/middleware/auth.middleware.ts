import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.service.js';
import { AppError } from '../exceptions/AppError.js';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError('Missing authentication token', 401);
        }

        if (!authHeader.startsWith('Bearer ')) {
            throw new AppError('Invalid authentication format', 401);
        }

        const token = authHeader.substring(7);

        if (!token) {
            throw new AppError('Empty authentication token', 401);
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            throw new AppError('Invalid authentication token', 401);
        }

        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);

            if (token) {
                const { data: { user }, error } = await supabase.auth.getUser(token);

                if (!error && user) {
                    req.user = user;
                }
            }
        }

        next();
    } catch (error) {
        next();
    }
};