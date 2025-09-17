import { supabase } from '../services/supabase.service.js';
import { UserModel } from '../models/User.js';
import { OAuthService } from '../services/oauth.service.js';
import { randomBytes } from 'crypto';
import { AppError } from '../exceptions/AppError.js';

export class AuthService {
    static async registerUser(validatedData: any) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: validatedData.email,
            password: validatedData.password,
        });

        if (authError) throw new AppError(authError.message, 400);
        if (!authData.user) throw new AppError('User creation failed', 500);

        const user = await UserModel.create({
            id: authData.user.id,
            email: validatedData.email,
            name: validatedData.name,
            company: validatedData.company,
            expertise: validatedData.expertise,
            phone: validatedData.phone,
            website: validatedData.website,
        });

        return { user, session: authData.session };
    }

    static async loginUser(validatedData: any) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: validatedData.email,
            password: validatedData.password,
        });

        if (error) throw new AppError('Invalid credentials', 401);
        if (!data.user || !data.session) throw new AppError('Login failed', 500);

        return { user: data.user, session: data.session };
    }

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

        await UserModel.upsertSocialAccount({
            user_id: user.id,
            platform,
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

        return { user, session: sessionData.session, isNewUser };
    }

    static async refreshToken(refresh_token: string) {
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token,
        });

        if (error) throw new AppError('Token refresh failed', 401);
        if (!data.session) throw new AppError('Session refresh failed', 500);

        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
        };
    }
}