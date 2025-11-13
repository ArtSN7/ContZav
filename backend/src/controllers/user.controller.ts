import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { AppError } from '../exceptions/AppError.js';

export class UserController {
    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const profile = await UserService.getProfile(req.user.id);

            res.json({
                success: true,
                data: { user: profile }
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const updatedProfile = await UserService.updateProfile(req.user.id, req.body);

            res.json({
                success: true,
                data: { user: updatedProfile },
                message: 'Profile updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getSocialAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const accounts = await UserService.getSocialAccounts(req.user.id);

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
            const account = await UserService.connectSocialAccount(req.user.id, platform, req.body);

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
            await UserService.disconnectSocialAccount(req.user.id, platform);

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
            await UserService.syncSocialAccount(req.user.id, platform);

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
            await UserService.updateSocialSettings(req.user.id, platform, req.body);

            res.json({
                success: true,
                message: 'Settings updated'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getActiveSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const sessions = await UserService.getActiveSessions(req.user.id);

            res.json({
                success: true,
                data: sessions
            });
        } catch (error) {
            next(error);
        }
    }

    static async terminateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { sessionId } = req.params;
            await UserService.terminateSession(req.user.id, sessionId);

            res.json({
                success: true,
                message: 'Session terminated'
            });
        } catch (error) {
            next(error);
        }
    }

    static async terminateAllSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            await UserService.terminateAllSessions(req.user.id, req.session?.id);

            res.json({
                success: true,
                message: 'All sessions terminated'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTwoFactorStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const profile = await UserService.getProfile(req.user.id);

            res.json({
                success: true,
                data: { enabled: profile.two_factor_enabled }
            });
        } catch (error) {
            next(error);
        }
    }

    static async enableTwoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { method, phoneNumber } = req.body;
            const user = await UserService.enableTwoFactor(req.user.id, method, phoneNumber);

            res.json({
                success: true,
                data: { backupCodes: user.two_factor_backup_codes },
                message: 'Two-factor authentication enabled'
            });
        } catch (error) {
            next(error);
        }
    }

    static async disableTwoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            await UserService.disableTwoFactor(req.user.id);

            res.json({
                success: true,
                message: 'Two-factor authentication disabled'
            });
        } catch (error) {
            next(error);
        }
    }
}