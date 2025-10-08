import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { OAuthService } from '../services/oauth.service.js';
import { generateState, getGoogleAuthUrl, getVKAuthUrl, getAppleAuthUrl } from '../utils/oauth.utils.js';
import { AppError } from '../exceptions/AppError.js';
import { AuthService } from '../services/auth.service.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export class AuthController {
    /**
     * Выйти из системы на всех устройствах
     * Завершает все активные сессии пользователя
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с подтверждением выхода
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Подтверждение успешного выхода
     */
    static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie('refreshToken');
            res.json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Тестовый метод для получения профиля (для разработки)
     * Возвращает моковые данные пользователя без обращения к БД
     * @param req - Запрос (авторизация не требуется)
     * @param res - Ответ с тестовыми данными профиля
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Полные тестовые данные пользователя
     */
    static async getProfileMock(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mockUser = {
                id: "12345",
                name: "Артем Сорокин",
                email: "artem.17sn@gmail.com",
                phone: "+7 (999) 123-45-67",
                avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            };

            const mockSocialAccounts = [
                {
                    provider: "youtube",
                    connected: true,
                    username: "@stroymaterials",
                    followers: "12.5K",
                    lastSync: "2 часа назад"
                },
                { provider: "instagram", connected: false, username: "@stroymaterials_ru", followers: "", lastSync: "" },
                { provider: "vk", connected: false, username: "stroymaterials", followers: "", lastSync: "" },
                {
                    provider: "telegram",
                    connected: true,
                    username: "@stroymaterials_channel",
                    followers: "3.4K",
                    lastSync: "5 минут назад"
                },
                { provider: "tiktok", connected: true, username: "", followers: "8.9K", lastSync: "1 час назад" },
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
                    {
                        device: "Chrome на Windows",
                        location: "Санкт-Петербург, Россия",
                        current: false,
                        lastActive: "1 день назад"
                    }
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

    /**
     * Получить полную информацию о профиле пользователя
     * Личные данные, подключенные соцсети, подписка и настройки безопасности
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с данными профиля
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Полные данные профиля пользователя
     */
    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const user = await User.findById(req.user.id);
            if (!user) throw new AppError('User not found', 404);

            res.json({
                success: true,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Начать авторизацию через Google OAuth
     * Возвращает ссылку для перехода на страницу Google
     * @param req - Запрос на начало OAuth процесса
     * @param res - Ответ с URL для авторизации и state токеном
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} URL для OAuth авторизации и state параметр
     */
    static async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const state = generateState();
            logger.info(`Generated state for Google OAuth: ${state}`);
            const authUrl = getGoogleAuthUrl(state);

            logger.info(`Generated Google auth URL: ${authUrl}`);

            res.json({
                success: true,
                data: { authUrl, state },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Обработать ответ от Google после авторизации
     * Система автоматически создает аккаунт если пользователь новый
     * @param req - Запрос с кодом авторизации от Google
     * @param req.query.code - Код авторизации от Google OAuth
     * @param req.query.state - State параметр для проверки безопасности
     * @param res - Редирект на фронтенд с токенами
     * @param next - Функция next Express для обработки ошибок
     * @returns {void} Редирект на фронтенд с параметрами авторизации
     */
    static async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, state, error: oauthError } = req.query;

            if (oauthError) {
                throw new AppError(`Google OAuth error: ${oauthError}`, 400);
            }

            if (!code) {
                throw new AppError('Authorization code required', 400);
            }

            const result = await AuthService.handleOAuthCallback('google', code as string);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.redirect(`${config.FRONTEND_URL}/dashboard?auth=success&accessToken=${result.accessToken}`);
        } catch (error: any) {
            logger.error('Google callback error:', error);
            res.redirect(`${config.FRONTEND_URL}/auth?error=${encodeURIComponent(error.message)}`);
        }
    }

    /**
     * Начать авторизацию через ВКонтакте OAuth
     * @param req - Запрос на начало OAuth процесса
     * @param res - Ответ с URL для авторизации ВК
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} URL для VK OAuth и state параметр
     */
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

    /**
     * Обработать ответ от ВКонтакте после авторизации
     * @param req - Запрос с кодом авторизации от VK
     * @param req.query.code - Код авторизации от VK OAuth
     * @param res - Редирект на фронтенд с токенами
     * @param next - Функция next Express для обработки ошибок
     * @returns {void} Редирект на фронтенд с параметрами авторизации
     */
    static async vkCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, error: oauthError } = req.query;

            if (oauthError) {
                throw new AppError(`VK OAuth error: ${oauthError}`, 400);
            }

            if (!code) {
                throw new AppError('Authorization code required', 400);
            }

            const result = await AuthService.handleOAuthCallback('vk', code as string);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.redirect(`${config.FRONTEND_URL}/dashboard?auth=success&accessToken=${result.accessToken}`);
        } catch (error: any) {
            res.redirect(`${config.FRONTEND_URL}/auth?error=${encodeURIComponent(error.message)}`);
        }
    }

    /**
     * Начать авторизацию через Apple OAuth
     * @param req - Запрос на начало OAuth процесса
     * @param res - Ответ с URL для авторизации Apple
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} URL для Apple OAuth и state параметр
     */
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

    /**
     * Обработать ответ от Apple после авторизации
     * @param req - Запрос с кодом авторизации от Apple
     * @param req.body.code - Код авторизации от Apple OAuth
     * @param res - Редирект на фронтенд с токенами
     * @param next - Функция next Express для обработки ошибок
     * @returns {void} Редирект на фронтенд с параметрами авторизации
     */
    static async appleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, error: oauthError } = req.body;

            if (oauthError) {
                throw new AppError(`Apple OAuth error: ${oauthError}`, 400);
            }

            if (!code) {
                throw new AppError('Authorization code required', 400);
            }

            const result = await AuthService.handleOAuthCallback('apple', code);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.redirect(`${config.FRONTEND_URL}/dashboard?auth=success&accessToken=${result.accessToken}`);
        } catch (error: any) {
            res.redirect(`${config.FRONTEND_URL}/auth?error=${encodeURIComponent(error.message)}`);
        }
    }

    /**
     * Обновить access токен с помощью refresh токена
     * Используется когда access токен истек
     * @param req - Запрос с refresh токеном в куках
     * @param res - Ответ с новыми токенами
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Новые access и refresh токены
     */
    static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) throw new AppError('Refresh token required', 401);

            const result = await AuthService.refreshToken(refreshToken);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.json({
                success: true,
                data: {
                    accessToken: result.accessToken
                },
                message: 'Token refreshed successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Вход пользователя с email и паролем
     * @param req - Запрос с учетными данными пользователя
     * @param req.body.email - Email пользователя
     * @param req.body.password - Пароль пользователя
     * @param res - Ответ с токенами и данными пользователя
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Токены и данные пользователя
     */
    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.json({
                success: true,
                data: {
                    user: result.user,
                    accessToken: result.accessToken
                },
                message: 'Login successful'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Регистрация нового пользователя
     * @param req - Запрос с данными для регистрации
     * @param req.body.email - Email пользователя
     * @param req.body.password - Пароль пользователя
     * @param req.body.name - Имя пользователя
     * @param res - Ответ с токенами и данными пользователя
     * @param next - Функция next Express для обработки ошибок
     * @returns {Object} Токены и данные пользователя
     */
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, name } = req.body;
            const result = await AuthService.register(email, password, name);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.status(201).json({
                success: true,
                data: {
                    user: result.user,
                    accessToken: result.accessToken
                },
                message: 'Registration successful'
            });
        } catch (error) {
            next(error);
        }
    }
}