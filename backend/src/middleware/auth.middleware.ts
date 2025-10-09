import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service.js';
import { logger } from '@/utils/logger.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        logger.info({
            message: 'Auth middleware called',
            path: req.path,
            method: req.method,
            authHeader: authHeader || 'MISSING',
            headers: req.headers
        }, 'Auth Middleware');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const token = authHeader.substring(7);
        const payload = TokenService.verifyToken(token);

        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role || 'user'
        };

        next();
    } catch (error: any) {
        logger.error({
            message: 'Token verification failed',
            error: error.message,
            stack: error.stack,
            path: req.path,
            authHeader: req.headers.authorization
        }, 'Auth Error');

        res.status(401).json({ error: 'Invalid token' });
    }
};