import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    logger.info({
        message: '📥 INCOMING REQUEST',
        method: req.method,
        url: req.url,
        path: req.path,
        query: req.query,
        headers: {
            authorization: req.headers.authorization ? 'present' : 'missing',
            origin: req.headers.origin,
            'user-agent': req.headers['user-agent']
        },
        ip: req.ip
    });

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            message: '📤 RESPONSE SENT',
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('Content-Length')
        });
    });

    next();
};