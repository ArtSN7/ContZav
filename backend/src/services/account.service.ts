import { AccountModel } from '../models/Account.js';
import { Subscription, PaymentHistory } from '../types/profile.js';
import { n8nService } from './n8n.service.js';

export class AccountService {
    static async getSubscription(userId: string): Promise<Subscription> {
        return AccountModel.getSubscription(userId);
    }

    static async updateSubscription(userId: string, plan: string): Promise<Subscription> {
        return AccountModel.updateSubscription(userId, plan);
    }

    static async getPaymentHistory(userId: string): Promise<PaymentHistory[]> {
        return AccountModel.getPaymentHistory(userId);
    }

    static async createPayment(userId: string, amount: number, currency: string): Promise<PaymentHistory> {
        return AccountModel.createPaymentRecord(userId, {
            amount,
            currency,
            status: 'pending',
            payment_method: 'card'
        });
    }

    static async syncSocialAccounts(userId: string): Promise<void> {
        await n8nService.triggerWorkflow('sync-social-accounts', { userId });
    }

    static async updateSocialSettings(userId: string, platform: string, settings: any): Promise<void> {
        await n8nService.triggerWorkflow('update-social-settings', { userId, platform, settings });
    }
}