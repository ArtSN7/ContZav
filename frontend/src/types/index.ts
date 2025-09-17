export interface FrontendUser {
    id: string;
    email: string;
    name: string;
    surname?: string;
    company?: string;
    expertise?: string;
    phone?: string;
    website?: string;
    bio?: string;
    avatar_url?: string;
    created_at: string;
}

export interface SocialAccount {
    id: string;
    platform: string;
    username: string;
    followers: string;
    status: string;
    last_sync: string;
}

export interface Subscription {
    name: string;
    price: number;
    billingCycle: string;
    nextBilling: string;
    status: string;
}

export interface Usage {
    videosUsed: number;
    videosLimit: number;
    networksUsed: number;
    networksLimit: number;
}