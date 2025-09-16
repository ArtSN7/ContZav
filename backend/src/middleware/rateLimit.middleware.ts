import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.NODE_ENV === 'production' ? 100 : 1000,
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts',
    standardHeaders: true,
    legacyHeaders: false,
});