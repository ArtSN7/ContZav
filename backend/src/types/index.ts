import { Document, Types } from 'mongoose';

export interface IAuthUser extends Document {
    email: string;
    password_hash: string;
    name: string;
    company: string;
    expertise: string;
    phone: string;
    website: string;
    avatar_url: string;
    created_at: Date;
    updated_at: Date;
}

export interface ISocialAccount extends Document {
    user_id: Types.ObjectId;
    platform: 'google' | 'vk' | 'apple' | 'youtube' | 'instagram' | 'telegram' | 'vkontakte';
    platform_user_id: string;
    email: string;
    username: string;
    access_token: string;
    refresh_token: string;
    expires_at: Date;
    profile_data: any;
    followers: number;
    last_sync: Date;
    is_connected: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IContentData extends Document {
    user_id: Types.ObjectId;
    title: string;
    content: string;
    content_type: 'video' | 'text' | 'combination';
    platform: 'youtube' | 'instagram' | 'vk' | 'telegram' | 'facebook' | 'tiktok';
    status: 'draft' | 'published' | 'scheduled';
    scheduled_date: Date;
    published_date: Date;
    metrics: any;
    created_at: Date;
    updated_at: Date;
}

export interface IOAuthToken {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
}

export interface IOAuthProfile {
    id: string;
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}