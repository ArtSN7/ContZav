import { User, SocialAccount } from '../models/User.js';
import { OAuthService } from './oauth.service.js';
import { randomBytes } from 'crypto';
import { AppError } from '../exceptions/AppError.js';
import { TokenService } from './token.service.js';
import { Types } from 'mongoose';

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

        let user = await User.findOne({ email: profile.email });
        let isNewUser = false;

        if (!user) {
            const password = randomBytes(32).toString('hex');
            user = new User({
                email: profile.email,
                password_hash: password,
                name: profile.name,
                avatar_url: profile.picture,
                email_verified: true
            });
            await user.save();
            isNewUser = true;
        }

        const expiresAt = tokens.expires_in ?
            new Date(Date.now() + tokens.expires_in * 1000) :
            undefined;

        await SocialAccount.findOneAndUpdate(
            {
                user_id: user._id,
                platform,
                platform_user_id: profile.id
            },
            {
                user_id: user._id,
                platform,
                platform_user_id: profile.id,
                email: profile.email,
                username: profile.name,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: expiresAt,
                profile_data: profile
            },
            { upsert: true, new: true }
        );

        const accessToken = TokenService.generateAccessToken(user._id.toString(), user.email);
        const refreshToken = TokenService.generateRefreshToken(user._id.toString());

        return { user, accessToken, refreshToken, isNewUser };
    }

    static async refreshToken(refreshToken: string) {
        try {
            const payload = TokenService.verifyToken(refreshToken);
            const user = await User.findById(payload.sub);

            if (!user) {
                throw new AppError('User not found', 401);
            }

            const newAccessToken = TokenService.generateAccessToken(user._id.toString(), user.email);
            const newRefreshToken = TokenService.generateRefreshToken(user._id.toString());

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new AppError('Invalid refresh token', 401);
        }
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        user.last_login = new Date();
        await user.save();

        const accessToken = TokenService.generateAccessToken(user._id.toString(), user.email);
        const refreshToken = TokenService.generateRefreshToken(user._id.toString());

        return { user, accessToken, refreshToken };
    }

    static async register(email: string, password: string, name: string) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        const user = new User({
            email,
            password_hash: password,
            name
        });
        await user.save();

        const accessToken = TokenService.generateAccessToken(user._id.toString(), user.email);
        const refreshToken = TokenService.generateRefreshToken(user._id.toString());

        return { user, accessToken, refreshToken };
    }
}