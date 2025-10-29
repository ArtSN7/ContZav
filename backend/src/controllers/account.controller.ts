import { Request, Response, NextFunction } from 'express';
import { AccountService } from '../services/account.service.js';
import { AppError } from '../exceptions/AppError.js';

export class AccountController {
    static async getSocialAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const accounts = await AccountService.getSocialAccounts(req.user.id);

            res.json({
                success: true,
                data: accounts.map(account => ({
                    provider: account.platform,
                    connected: account.is_connected,
                    username: account.username || '',
                    followers: account.followers?.toLocaleString() || '',
                    lastSync: account.last_sync ? new Date(account.last_sync).toLocaleDateString('ru-RU') : ''
                }))
            });
        } catch (error) {
            next(error);
        }
    }

    static async connectSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { platform } = req.params;
            const account = await AccountService.connectSocialAccount(req.user.id, platform, req.body);

            res.json({
                success: true,
                data: account,
                message: 'Account connected successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async disconnectSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { platform } = req.params;
            await AccountService.disconnectSocialAccount(req.user.id, platform);

            res.json({
                success: true,
                message: 'Account disconnected'
            });
        } catch (error) {
            next(error);
        }
    }

    static async syncSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { platform } = req.params;
            await AccountService.syncSocialAccount(req.user.id, platform);

            res.json({
                success: true,
                message: 'Account sync started'
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateSocialSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { platform } = req.params;
            await AccountService.updateSocialSettings(req.user.id, platform, req.body);

            res.json({
                success: true,
                message: 'Settings updated'
            });
        } catch (error) {
            next(error);
        }
    }
}