import { Request, Response, NextFunction } from 'express';
import { OAuthService } from '../services/oauth.service.js';
import { generateState, getGoogleAuthUrl, getVKAuthUrl, getYandexAuthUrl } from '../utils/oauth.utils.js';
import { AppError } from '../exceptions/AppError.js';
import { AuthService } from '../services/auth.service.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export class AuthController {
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

    static async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const state = generateState();
            const authUrl = getGoogleAuthUrl(state);

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

    static async yandexAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const state = generateState();
            const authUrl = getYandexAuthUrl(state);

            res.json({
                success: true,
                data: { authUrl, state },
            });
        } catch (error) {
            next(error);
        }
    }

    static async yandexCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, error: oauthError } = req.query;

            if (oauthError) {
                throw new AppError(`Yandex OAuth error: ${oauthError}`, 400);
            }

            if (!code) {
                throw new AppError('Authorization code required', 400);
            }

            const result = await AuthService.handleOAuthCallback('yandex', code as string);

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

    static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("here");
            const { refreshToken } = req.cookies;
            if (!refreshToken) throw new AppError('Refresh token required', 401);

            console.log({ refreshToken })

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
}