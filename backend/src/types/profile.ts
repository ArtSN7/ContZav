import { Document, Types } from 'mongoose';

export interface IUserProfile extends Document {
    user_id: Types.ObjectId;
    email: string;
    name: string;
    surname: string;
    company: string;
    expertise: string;
    phone: string;
    website: string;
    bio: string;
    avatar_url: string;
    created_at: Date;
    updated_at: Date;
}

export interface ITwoFactorSettings extends Document {
    user_id: Types.ObjectId;
    enabled: boolean;
    method: 'sms' | 'authenticator';
    phone_number: string;
    secret: string;
    backup_codes: string[];
    created_at: Date;
    updated_at: Date;
}

export interface IActiveSession extends Document {
    user_id: Types.ObjectId;
    device_info: string;
    ip_address: string;
    location: string;
    last_activity: Date;
    created_at: Date;
}

export interface ISubscription extends Document {
    user_id: Types.ObjectId;
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'expired';
    monthly_limit: number;
    social_networks_limit: number;
    current_usage: number;
    current_social_networks: number;
    next_payment_date: Date;
    price: number;
    currency: string;
    created_at: Date;
    updated_at: Date;
}

export interface IPaymentHistory extends Document {
    user_id: Types.ObjectId;
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'failed';
    payment_method: string;
    invoice_url: string;
    created_at: Date;
}