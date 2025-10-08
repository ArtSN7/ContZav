import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
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
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};