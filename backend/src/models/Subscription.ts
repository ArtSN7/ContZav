import { Document, Types, Schema, model } from 'mongoose';

export interface ISubscriptionPlan extends Document {
    name: string;
    price: number;
    currency: string;
    monthly_limit: number;
    social_networks_limit: number;
    max_content: number;
    max_ai_generations: number;
    features: string[];
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IUserSubscription extends Document {
    user_id: Types.ObjectId;
    plan_id: Types.ObjectId;
    status: 'active' | 'canceled' | 'expired';
    current_period_start: Date;
    current_period_end: Date;
    cancel_at_period_end: boolean;
    created_at: Date;
    updated_at: Date;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'RUB' },
    monthly_limit: { type: Number, required: true },
    social_networks_limit: { type: Number, required: true },
    max_content: { type: Number, required: true },
    max_ai_generations: { type: Number, required: true },
    features: [{ type: String }],
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const userSubscriptionSchema = new Schema<IUserSubscription>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan_id: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    status: { type: String, enum: ['active', 'canceled', 'expired'], default: 'active' },
    current_period_start: { type: Date, required: true },
    current_period_end: { type: Date, required: true },
    cancel_at_period_end: { type: Boolean, default: false }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

subscriptionPlanSchema.index({ is_active: 1, price: 1 });
userSubscriptionSchema.index({ user_id: 1 }, { unique: true });
userSubscriptionSchema.index({ status: 1 });

export const SubscriptionPlan = model<ISubscriptionPlan>('SubscriptionPlan', subscriptionPlanSchema);
export const UserSubscription = model<IUserSubscription>('UserSubscription', userSubscriptionSchema);