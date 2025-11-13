import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service.js';
import { AppError } from '../exceptions/AppError.js';

export class AvatarController {
    static async getAvatars(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const avatars = await AIService.getUserAvatars(req.user.id);

            res.json({
                success: true,
                data: avatars
            });
        } catch (error) {
            next(error);
        }
    }

    static async createAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const avatar = await AIService.createAvatar(req.user.id, req.body);

            res.json({
                success: true,
                data: avatar,
                message: 'Avatar created successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { avatarId } = req.params;
            await AIService.deleteAvatar(req.user.id, avatarId);

            res.json({
                success: true,
                message: 'Avatar deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}