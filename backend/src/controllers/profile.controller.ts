import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service.js';
import { AccountService } from '../services/account.service.js';
import { SubscriptionService } from '../services/subscription.service.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { AppError } from '../exceptions/AppError.js';

export class ProfileController {
    static async getTwoFactorSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const settings = await ProfileService.getTwoFactorSettings(req.user.id);

            res.json({
                success: true,
                data: settings
            });
        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('🟢 getProfile called with user:', req.user);

            if (!req.user) {
                console.log('🔴 No user in request');
                throw new AppError('Unauthorized', 401);
            }

            console.log('🟡 Fetching profile for user ID:', req.user.id);

            const profile = await ProfileService.getProfile(req.user.id);
            console.log('🟢 Profile fetched:', profile);

            res.json({
                success: true,
                data: {
                    user: profile
                }
            });
        } catch (error: any) {
            console.error('🔴 ProfileController error:', error);
            console.error('🔴 Error stack:', error.stack);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const updatedProfile = await ProfileService.updateProfile(req.user.id, req.body);

            res.json({
                success: true,
                data: { user: updatedProfile },
                message: 'Profile updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { currentPassword, newPassword } = req.body;
            await ProfileService.changePassword(req.user.id, currentPassword, newPassword);

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async enableTwoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { method, phoneNumber } = req.body;
            const settings = await ProfileService.enableTwoFactor(req.user.id, method, phoneNumber);

            res.json({
                success: true,
                data: { backupCodes: settings.backup_codes },
                message: 'Two-factor authentication enabled'
            });
        } catch (error) {
            next(error);
        }
    }

    static async disableTwoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            await ProfileService.disableTwoFactor(req.user.id);

            res.json({
                success: true,
                message: 'Two-factor authentication disabled'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getActiveSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const sessions = await ProfileService.getActiveSessions(req.user.id);

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
            await ProfileService.terminateSession(sessionId);

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

            await ProfileService.terminateAllSessions(req.user.id);

            res.json({
                success: true,
                message: 'All sessions terminated'
            });
        } catch (error) {
            next(error);
        }
    }

    private static formatLastActive(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} дней назад`;
        if (hours > 0) return `${hours} часов назад`;
        if (minutes > 0) return `${minutes} минут назад`;
        return 'Сейчас';
    }
}