import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/session.service.js';

export const trackSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.user && req.session?.id) {
        try {
            await SessionService.updateSessionActivity(req.session.id);
        } catch (error) {
            console.error('Failed to update session activity:', error);
        }
    }
    next();
};