import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
    user_id: Types.ObjectId;
    plan: string;
    status: 'active' | 'canceled' | 'past_due';
    current_period_start: Date;
    current_period_end: Date;
    cancel_at_period_end: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IPaymentHistory extends Document {
    user_id: Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    payment_method: string;
    invoice_url?: string;
    created_at: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, required: true },
    status: { type: String, enum: ['active', 'canceled', 'past_due'], required: true },
    current_period_start: { type: Date, required: true },
    current_period_end: { type: Date, required: true },
    cancel_at_period_end: { type: Boolean, default: false }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const paymentHistorySchema = new Schema<IPaymentHistory>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'RUB' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    payment_method: { type: String, required: true },
    invoice_url: { type: String }
}, {
    timestamps: { createdAt: 'created_at' }
});

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
export const PaymentHistory = model<IPaymentHistory>('PaymentHistory', paymentHistorySchema);