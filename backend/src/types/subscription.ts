import { Document, Types } from 'mongoose';

export interface ISubscriptionPlan extends Document {
    name: string;
    price: number;
    currency: string;
    monthly_limit: number;
    social_networks_limit: number;
    features: string[];
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IUserSubscription extends Document {
    user_id: Types.ObjectId;
    plan_id: Types.ObjectId;
    status: 'active' | 'canceled' | 'expired';
    current_usage: number;
    current_social_networks: number;
    next_payment_date: Date;
    created_at: Date;
    updated_at: Date;
}