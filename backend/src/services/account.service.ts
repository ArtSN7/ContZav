import { Subscription, PaymentHistory } from '../models/Account.js';
import { UserSubscription } from '../models/Subscription.js';
import { n8nService } from './n8n.service.js';
import { Types } from 'mongoose';

export class AccountService {
    static async getSubscription(userId: string): Promise<any> {
        const subscription = await UserSubscription.findOne({ user_id: new Types.ObjectId(userId) })
            .populate('plan_id');
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        return subscription;
    }

    static async updateSubscription(userId: string, planId: string): Promise<any> {
        const subscription = await UserSubscription.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId) },
            {
                plan_id: new Types.ObjectId(planId),
                status: 'active',
                current_period_start: new Date(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            { new: true, upsert: true }
        ).populate('plan_id');
        return subscription;
    }

    static async getPaymentHistory(userId: string): Promise<any[]> {
        const payments = await PaymentHistory.find({ user_id: new Types.ObjectId(userId) })
            .sort({ created_at: -1 });
        return payments;
    }

    static async createPayment(userId: string, amount: number, currency: string): Promise<any> {
        const payment = new PaymentHistory({
            user_id: new Types.ObjectId(userId),
            amount,
            currency,
            status: 'pending',
            payment_method: 'card'
        });
        await payment.save();
        return payment;
    }

    static async syncSocialAccounts(userId: string): Promise<void> {
        await n8nService.triggerWorkflow('sync-social-accounts', { userId });
    }

    static async updateSocialSettings(userId: string, platform: string, settings: any): Promise<void> {
        await n8nService.triggerWorkflow('update-social-settings', { userId, platform, settings });
    }
}