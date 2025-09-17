import axios from 'axios';
import { config } from '../config/index.js';
import { OAuthToken, OAuthProfile } from '../types/index.js';
import { logger } from '@/utils/logger.js';

export class OAuthService {
    static async exchangeGoogleCode(code: string): Promise<{ tokens: OAuthToken; profile: OAuthProfile }> {
        try {
            const redirectUri = `${config.BACKEND_URL}/api/auth/google/callback`;

            logger.info(`Exchanging Google code with redirect_uri: ${redirectUri}`);

            const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
                client_id: config.GOOGLE_CLIENT_ID,
                client_secret: config.GOOGLE_CLIENT_SECRET,
                code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            });

            const tokens = tokenResponse.data;

            logger.info('Google token response:', tokens);

            const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            logger.info('Google profile response:', profileResponse.data);

            return {
                tokens,
                profile: profileResponse.data,
            };
        } catch (error: any) {
            logger.error('Google OAuth exchange error:', error.response?.data || error.message);
            throw error;
        }
    }


    static async exchangeVKCode(code: string): Promise<{ tokens: OAuthToken; profile: OAuthProfile }> {
        const tokenResponse = await axios.get('https://oauth.vk.com/access_token', {
            params: {
                client_id: config.VK_CLIENT_ID,
                client_secret: config.VK_CLIENT_SECRET,
                code,
                redirect_uri: `${config.FRONTEND_URL}/api/auth/vk/callback`,
            },
        });

        const tokens = tokenResponse.data;

        const profileResponse = await axios.get('https://api.vk.com/method/users.get', {
            params: {
                access_token: tokens.access_token,
                v: '5.199',
                fields: 'photo_200,email',
            },
        });

        const userData = profileResponse.data.response[0];

        return {
            tokens,
            profile: {
                id: userData.id.toString(),
                email: tokens.email,
                name: `${userData.first_name} ${userData.last_name}`,
                given_name: userData.first_name,
                family_name: userData.last_name,
                picture: userData.photo_200,
            },
        };
    }

    static async exchangeAppleCode(code: string): Promise<{ tokens: OAuthToken; profile: OAuthProfile }> {
        const tokenResponse = await axios.post('https://appleid.apple.com/auth/token', new URLSearchParams({
            client_id: config.APPLE_CLIENT_ID,
            client_secret: await this.generateAppleClientSecret(),
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${config.FRONTEND_URL}/api/auth/apple/callback`,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const tokens = tokenResponse.data;

        const idToken = tokens.id_token;
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());

        return {
            tokens,
            profile: {
                id: payload.sub,
                email: payload.email,
                name: payload.name || '',
            },
        };
    }

    private static async generateAppleClientSecret(): Promise<string> {
        const jwt = require('jsonwebtoken');
        const privateKey = config.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n');

        return jwt.sign({
            iss: config.APPLE_TEAM_ID,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 86400 * 180,
            aud: 'https://appleid.apple.com',
            sub: config.APPLE_CLIENT_ID,
        }, privateKey, {
            algorithm: 'ES256',
            keyid: config.APPLE_KEY_ID,
        });
    }
}