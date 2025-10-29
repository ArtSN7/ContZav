import { SocialAccount } from '../models/User.js';
import { PaymentHistory } from '../models/Account.js';
import { N8nService } from './n8n.service.js';
import { Types } from 'mongoose';

export class AccountService {
    static async getSocialAccounts(userId: string): Promise<any[]> {
        return SocialAccount.find({ user_id: new Types.ObjectId(userId) });
    }

    static async getPaymentHistory(userId: string): Promise<any[]> {
        return PaymentHistory.find({ user_id: new Types.ObjectId(userId) })
            .sort({ created_at: -1 });
    }

    static async connectSocialAccount(userId: string, platform: string, accountData: any): Promise<any> {
        const socialAccount = await SocialAccount.findOneAndUpdate(
            {
                user_id: new Types.ObjectId(userId),
                platform,
                platform_user_id: accountData.platform_user_id
            },
            {
                ...accountData,
                is_connected: true,
                last_sync: new Date()
            },
            { upsert: true, new: true }
        );

        await N8nService.triggerWorkflow('sync-social-accounts', {
            userId,
            platform,
            accountId: socialAccount._id
        });

        return socialAccount;
    }

    static async disconnectSocialAccount(userId: string, platform: string): Promise<void> {
        await SocialAccount.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId), platform },
            { is_connected: false, access_token: '', refresh_token: '' }
        );
    }

    static async syncSocialAccount(userId: string, platform: string): Promise<void> {
        const account = await SocialAccount.findOne({
            user_id: new Types.ObjectId(userId),
            platform,
            is_connected: true
        });

        if (!account) {
            throw new Error('Account not found or not connected');
        }

        await N8nService.triggerWorkflow('sync-social-metrics', {
            userId,
            platform,
            accountId: account._id,
            accessToken: account.access_token
        });

        await SocialAccount.findByIdAndUpdate(account._id, {
            last_sync: new Date()
        });
    }

    static async updateSocialSettings(userId: string, platform: string, settings: any): Promise<void> {
        await SocialAccount.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId), platform },
            { settings }
        );

        await N8nService.triggerWorkflow('update-social-settings', {
            userId,
            platform,
            settings
        });
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
}