// middleware/session.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';

export const trackSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.user && req.session?.id) {
        try {
            await UserService.updateSessionActivity(req.session.id);
        } catch (error) {
            console.error('Failed to update session activity:', error);
        }
    }
    next();
};