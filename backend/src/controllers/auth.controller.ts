import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.service.js';
import { UserModel } from '../models/User.js';
import { OAuthService } from '../services/oauth.service.js';
import { generateState, getGoogleAuthUrl, getVKAuthUrl, getAppleAuthUrl } from '../utils/oauth.utils.js';
import { AppError } from '../exceptions/AppError.js';
import { randomBytes } from 'crypto';
import { AuthService } from '@/services/auth.service.js';
import { logger } from '@/utils/logger.js';
import { config } from '@/config/index.js';

export class AuthController {
    static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw new AppError('Logout failed', 500);

            res.json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error) {
            next(error);
        }
    }

    static async getProfileMock(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mockUser = {
                id: "12345",
                name: "Иван Петров",
                email: "ivan.petrov@example.com",
                phone: "+7 (999) 123-45-67",
                company: "ООО 'ТехноЛогика'",
                bio: "Full-stack разработчик с 5-летним опытом. Специализируюсь на React и Node.js",
                website: "https://ivan-petrov-portfolio.ru",
                avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            };

            const mockSocialAccounts = [
                { provider: "youtube", connected: true, username: "@stroymaterials", followers: "12.5K", lastSync: "2 часа назад" },
                { provider: "instagram", connected: true, username: "@stroymaterials_ru", followers: "8.9K", lastSync: "1 час назад" },
                { provider: "vk", connected: true, username: "stroymaterials", followers: "15.2K", lastSync: "30 минут назад" },
                { provider: "telegram", connected: true, username: "@stroymaterials_channel", followers: "3.4K", lastSync: "5 минут назад" },
                { provider: "tiktok", connected: false, username: "", followers: "", lastSync: "" },
                { provider: "facebook", connected: false, username: "", followers: "", lastSync: "" }
            ];

            const mockSubscription = {
                plan: "Pro",
                price: 5990,
                billingCycle: "monthly",
                nextBilling: "15 января 2025",
                status: "active",
                usage: {
                    videosUsed: 32,
                    videosLimit: 50,
                    networksUsed: 5,
                    networksLimit: 10
                },
                billingHistory: [
                    { date: "15.12.2024", amount: 5990, status: "paid", invoice: "INV-001234" },
                    { date: "15.11.2024", amount: 5990, status: "paid", invoice: "INV-001233" },
                    { date: "15.10.2024", amount: 5990, status: "paid", invoice: "INV-001232" }
                ]
            };

            const mockSecurity = {
                twoFactorEnabled: true,
                activeSessions: [
                    { device: "MacBook Pro", location: "Москва, Россия", current: true, lastActive: "Сейчас" },
                    { device: "iPhone 15", location: "Москва, Россия", current: false, lastActive: "2 часа назад" },
                    { device: "Chrome на Windows", location: "Санкт-Петербург, Россия", current: false, lastActive: "1 день назад" }
                ]
            };

            res.json({
                success: true,
                data: {
                    user: mockUser,
                    socialAccounts: mockSocialAccounts,
                    subscription: mockSubscription,
                    security: mockSecurity
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const user = await UserModel.findById(req.user.id);
            const socialAccounts = await UserModel.getSocialAccounts(req.user.id);

            res.json({
                success: true,
                data: { user, socialAccounts },
            });
        } catch (error) {
            next(error);
        }
    }

    static async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const state = generateState();
            logger.info(`Generated state for Google OAuth: ${state}`);
            const authUrl = getGoogleAuthUrl(state);

            logger.info(`Generated Google auth URl: ${authUrl}`);

            res.json({
                success: true,
                data: { authUrl, state },
            });
        } catch (error) {
            next(error);
        }
    }

    static async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code } = req.query;
            const result = await AuthService.handleOAuthCallback('google', code as string);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            res.redirect(`${config.FRONTEND_URL}/dashboard?auth=success&accessToken=${result.accessToken}`);
        } catch (error) {
            res.redirect(`${config.FRONTEND_URL}/auth?error=${encodeURIComponent(error.message)}`);
        }
    }

    static async vkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const state = generateState();
            const authUrl = getVKAuthUrl(state);

            res.json({
                success: true,
                data: { authUrl, state },
            });
        } catch (error) {
            next(error);
        }
    }

    static async vkCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code } = req.query;
            const result = await AuthService.handleOAuthCallback('vk', code as string);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            res.redirect(`${config.FRONTEND_URL}/dashboard?auth=success&accessToken=${result.accessToken}`);
        } catch (error) {
            res.redirect(`${config.FRONTEND_URL}/auth?error=${encodeURIComponent(error.message)}`);
        }
    }

    static async appleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const state = generateState();
            const authUrl = getAppleAuthUrl(state);

            res.json({
                success: true,
                data: { authUrl, state },
            });
        } catch (error) {
            next(error);
        }
    }

    static async appleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code } = req.body;
            const result = await AuthService.handleOAuthCallback('apple', code);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            res.redirect(`${config.FRONTEND_URL}/dashboard?auth=success&accessToken=${result.accessToken}`);
        } catch (error) {
            res.redirect(`${config.FRONTEND_URL}/auth?error=${encodeURIComponent(error.message)}`);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> { // поправить
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) throw new AppError('Refresh token required', 401);

            const result = await AuthService.refreshToken(refreshToken);

            res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            res.json({
                success: true,
                message: 'Token refreshed successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}