import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscriptionPlan extends Document {
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    max_content: number;
    max_ai_generations: number;
    analytics_access: boolean;
    priority_support: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IUserSubscription extends Document {
    user_id: Types.ObjectId;
    plan_id: Types.ObjectId;
    status: 'active' | 'canceled' | 'past_due';
    current_period_start: Date;
    current_period_end: Date;
    cancel_at_period_end: boolean;
    stripe_subscription_id?: string;
    created_at: Date;
    updated_at: Date;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'RUB' },
    interval: { type: String, enum: ['month', 'year'], required: true },
    features: [{ type: String }],
    max_content: { type: Number, required: true },
    max_ai_generations: { type: Number, required: true },
    analytics_access: { type: Boolean, default: false },
    priority_support: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const userSubscriptionSchema = new Schema<IUserSubscription>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan_id: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    status: { type: String, enum: ['active', 'canceled', 'past_due'], required: true },
    current_period_start: { type: Date, required: true },
    current_period_end: { type: Date, required: true },
    cancel_at_period_end: { type: Boolean, default: false },
    stripe_subscription_id: { type: String }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

subscriptionPlanSchema.index({ price: 1 });
userSubscriptionSchema.index({ user_id: 1 });
userSubscriptionSchema.index({ status: 1 });

export const SubscriptionPlan = model<ISubscriptionPlan>('SubscriptionPlan', subscriptionPlanSchema);
export const UserSubscription = model<IUserSubscription>('UserSubscription', userSubscriptionSchema);