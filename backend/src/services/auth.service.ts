import { supabase } from '../services/supabase.service.js';
import { UserModel } from '../models/User.js';
import { OAuthService } from '../services/oauth.service.js';
import { randomBytes } from 'crypto';
import { AppError } from '../exceptions/AppError.js';
import { TokenService } from './token.service.js';

export class AuthService {
    static async handleOAuthCallback(platform: string, code: string) {
        let tokens: any;
        let profile: any;

        switch (platform) {
            case 'google':
                ({ tokens, profile } = await OAuthService.exchangeGoogleCode(code));
                break;
            case 'vkontakte':
                ({ tokens, profile } = await OAuthService.exchangeVKCode(code));
                break;
            case 'apple':
                ({ tokens, profile } = await OAuthService.exchangeAppleCode(code));
                break;
            default:
                throw new AppError('Unsupported OAuth platform', 400);
        }

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

        const expiresAt = tokens.expires_in ?
            new Date(Date.now() + tokens.expires_in * 1000).toISOString() :
            undefined;

        await UserModel.upsertSocialAccount({
            user_id: user.id,
            platform,
            platform_user_id: profile.id,
            email: profile.email,
            username: profile.name,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: expiresAt,
            profile_data: profile,
        });

        const accessToken = TokenService.generateAccessToken(user.id, user.email);
        const refreshToken = TokenService.generateRefreshToken(user.id);

        return { user, accessToken, refreshToken, isNewUser };
    }

    static async refreshToken(refreshToken: string) {
        try {
            const { data, error } = await supabase.auth.refreshSession({
                refresh_token: refreshToken
            });

            if (error) throw new AppError('Invalid refresh token', 401);
            if (!data.session) throw new AppError('Session refresh failed', 500);

            const accessToken = TokenService.generateAccessToken(data.session.user.id, data.session.user.email);
            const newRefreshToken = data.session.refresh_token;

            return { accessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new AppError('Invalid refresh token', 401);
        }
    }
}