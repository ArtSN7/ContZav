export * from './analytics.js';

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    company?: string;
    expertise?: string;
    phone?: string;
    website?: string;
    avatar_url?: string;
    created_at: Date;
    updated_at: Date;
}

export interface SocialAccount {
    id: string;
    user_id: string;
    platform: 'google' | 'vk' | 'apple' | 'youtube' | 'instagram' | 'telegram' | 'vkontakte';
    platform_user_id: string;
    email: string;
    username: string;
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
    profile_data: any;
    followers: number;
    last_sync: Date;
    is_connected: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ContentData {
    id: string;
    user_id: string;
    title: string;
    content: string;
    content_type: 'video' | 'text' | 'combination';
    platform: 'youtube' | 'instagram' | 'vk' | 'telegram' | 'facebook' | 'tiktok';
    status: 'draft' | 'published' | 'scheduled';
    scheduled_date?: Date;
    published_date?: Date;
    metrics?: any;
    created_at: Date;
    updated_at: Date;
}

export interface OAuthToken {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
    scope?: string;
}

export interface OAuthProfile {
    id: string;
    email: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    locale?: string;
}