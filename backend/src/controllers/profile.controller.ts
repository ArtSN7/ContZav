import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.js';
import { SocialService } from '../services/social.service.js';
import { AppError } from '../exceptions/AppError.js';

export class ProfileController {
    static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { name, company, expertise, phone, website } = req.body;
            const user = await UserModel.updateProfile(req.user.id, {
                name,
                company,
                expertise,
                phone,
                website,
            });

            res.json({
                success: true,
                data: user,
                message: 'Profile updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async connectSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { platform, credentials } = req.body;
            await SocialService.connectAccount(platform, credentials, req.user.id);

            res.json({
                success: true,
                message: 'Social account connected successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async disconnectSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { accountId } = req.body;
            await SocialService.disconnectAccount(accountId);

            res.json({
                success: true,
                message: 'Social account disconnected successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}