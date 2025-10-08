import { SocialAccount } from '../models/User.js';
import { n8nService } from './n8n.service.js';
import { Types } from 'mongoose';

export class SocialService {
    static async connectAccount(platform: string, credentials: any, userId: string): Promise<void> {
        await SocialAccount.findOneAndUpdate(
            {
                user_id: new Types.ObjectId(userId),
                platform,
                platform_user_id: credentials.user_id
            },
            {
                user_id: new Types.ObjectId(userId),
                platform,
                platform_user_id: credentials.user_id,
                email: credentials.email,
                username: credentials.username,
                access_token: credentials.access_token,
                refresh_token: credentials.refresh_token,
                expires_at: credentials.expires_at,
                profile_data: credentials.profile_data
            },
            { upsert: true, new: true }
        );
    }

    static async disconnectAccount(accountId: string): Promise<void> {
        await SocialAccount.findByIdAndDelete(accountId);
    }

    static async getUserSocialAccounts(userId: string): Promise<any[]> {
        return SocialAccount.find({ user_id: new Types.ObjectId(userId) });
    }

    static async getSocialAccountById(accountId: string): Promise<any> {
        const account = await SocialAccount.findById(accountId);
        if (!account) throw new Error('Social account not found');
        return account;
    }

    static async schedulePost(content: any, platforms: string[], scheduleDate: Date): Promise<void> {
        const publishData = {
            content,
            platforms,
            scheduleDate: scheduleDate.toISOString(),
        };

        await n8nService.triggerWorkflow('publish-content', publishData);
    }

    static async syncAccountData(accountId: string): Promise<void> {
        const account = await SocialAccount.findById(accountId);
        if (!account) throw new Error('Social account not found');

        await n8nService.triggerWorkflow('sync-account-data', {
            accountId: account._id.toString(),
            platform: account.platform,
            accessToken: account.access_token
        });
    }

    static async updateAccountToken(accountId: string, newToken: string, expiresAt?: Date): Promise<void> {
        await SocialAccount.findByIdAndUpdate(accountId, {
            access_token: newToken,
            expires_at: expiresAt
        });
    }
}