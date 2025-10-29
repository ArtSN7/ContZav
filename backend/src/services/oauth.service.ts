import axios from 'axios';
import { config } from '../config/index.js';
import { IOAuthToken, IOAuthProfile } from '../types/index.js';
import { logger } from '@/utils/logger.js';

export class OAuthService {
    static async exchangeGoogleCode(code: string): Promise<{ tokens: IOAuthToken; profile: IOAuthProfile }> {
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

    static async exchangeVKCode(code: string): Promise<{ tokens: IOAuthToken; profile: IOAuthProfile }> {
        const redirectUri = `${config.BACKEND_URL}/api/auth/vk/callback`;

        const tokenResponse = await axios.get('https://oauth.vk.com/access_token', {
            params: {
                client_id: config.VK_CLIENT_ID,
                client_secret: config.VK_CLIENT_SECRET,
                code,
                redirect_uri: redirectUri,
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

    static async exchangeYandexCode(code: string): Promise<{ tokens: IOAuthToken; profile: IOAuthProfile }> {
        const redirectUri = `${config.BACKEND_URL}/api/auth/yandex/callback`;

        const tokenResponse = await axios.post('https://oauth.yandex.ru/token', new URLSearchParams({
            client_id: config.YANDEX_CLIENT_ID,
            client_secret: config.YANDEX_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const tokens = tokenResponse.data;

        const profileResponse = await axios.get('https://login.yandex.ru/info', {
            headers: { Authorization: `OAuth ${tokens.access_token}` },
            params: {
                format: 'json'
            }
        });

        const userData = profileResponse.data;

        return {
            tokens,
            profile: {
                id: userData.id,
                email: userData.default_email,
                name: userData.real_name || userData.display_name || userData.login,
                given_name: userData.first_name,
                family_name: userData.last_name,
                picture: userData.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${userData.default_avatar_id}/islands-200` : undefined,
            },
        };
    }
}