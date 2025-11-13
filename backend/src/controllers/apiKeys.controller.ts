import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service.js';
import { AppError } from '../exceptions/AppError.js';

export class ApiKeysController {
    static async getApiKeys(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const apiKeys = await AIService.getUserApiKeys(req.user.id);

            res.json({
                success: true,
                data: apiKeys
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateApiKeys(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { heygen_api_key, openai_api_key } = req.body;
            await AIService.updateUserApiKeys(req.user.id, { heygen_api_key, openai_api_key });

            res.json({
                success: true,
                message: 'API keys updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}