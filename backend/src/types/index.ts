export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    company?: string;
    expertise?: string;
    phone?: string;
    website?: string;
    avatar_url?: string;
}

export interface ContentData {
    id: string;
    user_id: string;
    title: string;
    description: string;
    niche: string;
    content_type: 'video' | 'text' | 'combination';
    generated_content: any;
    platforms: string[];
    status: 'draft' | 'published' | 'scheduled';
    tags?: string[];
    created_at: Date;
}

export interface AnalyticsData {
    id: string;
    content_id: string;
    platform: string;
    views: number;
    engagement: number;
    clicks: number;
    date: Date;
}

export interface SocialAccount {
    id: string;
    user_id: string;
    platform: string;
    username: string;
    followers: number;
    last_sync: Date;
    is_connected: boolean;
}