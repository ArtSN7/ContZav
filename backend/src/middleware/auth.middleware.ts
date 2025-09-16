import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.service.js';
import { AppError } from '../exceptions/AppError.js';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('Missing authentication token', 401);
        }

        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            throw new AppError('Invalid authentication token', 401);
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
            const { data: { user } } = await supabase.auth.getUser(token);
            req.user = user;
        }
        next();
    } catch {
        next();
    }
};