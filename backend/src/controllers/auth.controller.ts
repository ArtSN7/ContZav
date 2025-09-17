import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.service.js';
import { UserModel } from '../models/User.js';
import { OAuthService } from '../services/oauth.service.js';
import { generateState, getGoogleAuthUrl, getVKAuthUrl, getAppleAuthUrl } from '../utils/oauth.utils.js';
import { AppError } from '../exceptions/AppError.js';
import { loginSchema, registerSchema, oauthCallbackSchema } from '../dtos/auth.dto.js';
import { randomBytes } from 'crypto';
import { AuthService } from '@/services/auth.service.js';
import { logger } from '@/utils/logger.js';

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = registerSchema.parse(req.body);
            const result = await AuthService.registerUser(validatedData);

            res.status(201).json({
                success: true,
                data: result,
                message: 'User registered successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await AuthService.loginUser(validatedData);

            res.json({
                success: true,
                data: result,
                message: 'Login successful',
            });
        } catch (error) {
            next(error);
        }
    }

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
            const { code } = oauthCallbackSchema.parse(req.query);
            const result = await AuthService.handleOAuthCallback('google', code as string);

            res.json({
                success: true,
                data: result,
                message: 'Google authentication successful',
            });
        } catch (error) {
            next(error);
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
            const { code, state } = oauthCallbackSchema.parse(req.query);

            const { tokens, profile } = await OAuthService.exchangeVKCode(code as string);

            let user = await UserModel.findByEmail(profile.email);
            let isNewUser = false;

            if (!user) {
                const password = randomBytes(32).toString('hex');
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: profile.email,
                    password: password,
                });

                if (authError) throw new AppError(authError.message, 400);
                if (!authData.user) throw new AppError('User creation failed', 500);

                user = await UserModel.create({
                    id: authData.user.id,
                    email: profile.email,
                    name: profile.name,
                    avatar_url: profile.picture,
                });
                isNewUser = true;
            }

            await UserModel.upsertSocialAccount({
                user_id: user.id,
                platform: 'vkontakte',
                platform_user_id: profile.id,
                email: profile.email,
                username: profile.name,
                access_token: tokens.access_token,
                expires_at: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
                profile_data: profile,
            });

            const { data: sessionData } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: '',
            });

            if (!sessionData.session) throw new AppError('Session creation failed', 500);

            res.json({
                success: true,
                data: {
                    user,
                    session: sessionData.session,
                    isNewUser,
                },
                message: 'VK authentication successful',
            });
        } catch (error) {
            next(error);
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
            const { code, state } = req.body;

            const { tokens, profile } = await OAuthService.exchangeAppleCode(code);

            let user = await UserModel.findByEmail(profile.email);
            let isNewUser = false;

            if (!user) {
                const password = randomBytes(32).toString('hex');
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: profile.email,
                    password: password,
                });

                if (authError) throw new AppError(authError.message, 400);
                if (!authData.user) throw new AppError('User creation failed', 500);

                user = await UserModel.create({
                    id: authData.user.id,
                    email: profile.email,
                    name: profile.name,
                });
                isNewUser = true;
            }

            await UserModel.upsertSocialAccount({
                user_id: user.id,
                platform: 'apple',
                platform_user_id: profile.id,
                email: profile.email,
                username: profile.name,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
                profile_data: profile,
            });

            const { data: sessionData } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: '',
            });

            if (!sessionData.session) throw new AppError('Session creation failed', 500);

            res.json({
                success: true,
                data: {
                    user,
                    session: sessionData.session,
                    isNewUser,
                },
                message: 'Apple authentication successful',
            });
        } catch (error) {
            next(error);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refresh_token } = req.body;

            const { data, error } = await supabase.auth.refreshSession({
                refresh_token,
            });

            if (error) throw new AppError('Token refresh failed', 401);
            if (!data.session) throw new AppError('Session refresh failed', 500);

            res.json({
                success: true,
                data: {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: data.session.expires_at,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}