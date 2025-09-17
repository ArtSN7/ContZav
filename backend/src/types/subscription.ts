export interface SubscriptionPlan {
    id: string;
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

export interface UserSubscription {
    id: string;
    user_id: string;
    plan_id: string;
    status: 'active' | 'canceled' | 'expired';
    current_usage: number;
    current_social_networks: number;
    next_payment_date: Date;
    created_at: Date;
    updated_at: Date;
}