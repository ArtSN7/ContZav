import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.service.js';
import { UserModel } from '../models/User.model.js';
import { OAuthService } from '../services/oauth.service.js';
import { generateState, getGoogleAuthUrl, getVKAuthUrl, getAppleAuthUrl } from '../utils/oauth.utils.js';
import { AppError } from '../exceptions/AppError.js';
import { loginSchema, registerSchema, oauthCallbackSchema } from '../dtos/auth.dto.js';

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = registerSchema.parse(req.body);

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: validatedData.email,
                password: validatedData.password,
            });

            if (authError) throw new AppError(authError.message, 400);

            const user = await UserModel.create({
                id: authData.user!.id,
                email: validatedData.email,
                name: validatedData.name,
                company: validatedData.company,
                expertise: validatedData.expertise,
                phone: validatedData.phone,
                website: validatedData.website,
            });

            res.status(201).json({
                success: true,
                data: { user, session: authData.session },
                message: 'User registered successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = loginSchema.parse(req.body);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: validatedData.email,
                password: validatedData.password,
            });

            if (error) throw new AppError('Invalid credentials', 401);

            res.json({
                success: true,
                data: { user: data.user, session: data.session },
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
            const { code, state } = oauthCallbackSchema.parse(req.query);

            const { tokens, profile } = await OAuthService.exchangeGoogleCode(code as string);

            let user = await UserModel.findByEmail(profile.email);
            let isNewUser = false;

            if (!user) {
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: profile.email,
                    password: randomBytes(32).toString('hex'),
                });

                if (authError) throw new AppError(authError.message, 400);

                user = await UserModel.create({
                    id: authData.user!.id,
                    email: profile.email,
                    name: profile.name,
                    avatar_url: profile.picture,
                });
                isNewUser = true;
            }

            await UserModel.upsertSocialAccount({
                user_id: user.id,
                platform: 'google',
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

            res.json({
                success: true,
                data: {
                    user,
                    session: sessionData.session,
                    isNewUser,
                },
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
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: profile.email,
                    password: randomBytes(32).toString('hex'),
                });

                if (authError) throw new AppError(authError.message, 400);

                user = await UserModel.create({
                    id: authData.user!.id,
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
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: profile.email,
                    password: randomBytes(32).toString('hex'),
                });

                if (authError) throw new AppError(authError.message, 400);

                user = await UserModel.create({
                    id: authData.user!.id,
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

function randomBytes(arg0: number) {
    throw new Error('Function not implemented.');
}