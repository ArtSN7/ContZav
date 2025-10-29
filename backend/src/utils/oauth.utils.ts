import { randomBytes } from 'crypto';
import { config } from '../config/index.js';

export const generateState = (): string => {
    return randomBytes(16).toString('hex');
};

export const getGoogleAuthUrl = (state: string): string => {
    const params = new URLSearchParams({
        client_id: config.GOOGLE_CLIENT_ID,
        redirect_uri: `${config.BACKEND_URL}/api/auth/google/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        access_type: 'offline',
        prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

export const getVKAuthUrl = (state: string): string => {
    const params = new URLSearchParams({
        client_id: config.VK_CLIENT_ID,
        redirect_uri: `${config.BACKEND_URL}/api/auth/vk/callback`,
        response_type: 'code',
        scope: 'email',
        state,
        v: '5.199',
    });
    return `https://oauth.vk.com/authorize?${params}`;
};

export const getYandexAuthUrl = (state: string): string => {
    const params = new URLSearchParams({
        client_id: config.YANDEX_CLIENT_ID,
        redirect_uri: `${config.BACKEND_URL}/api/auth/yandex/callback`,
        response_type: 'code',
        scope: 'login:email login:info',
        state,
    });
    return `https://oauth.yandex.ru/authorize?${params}`;
};