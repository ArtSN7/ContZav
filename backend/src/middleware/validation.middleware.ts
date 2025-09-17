import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { AppError } from '../exceptions/AppError.js';

export const validate = (schema: ZodObject<any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const message = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
                throw new AppError(`Validation failed: ${message}`, 400);
            }
            next(error);
        }
    };
};