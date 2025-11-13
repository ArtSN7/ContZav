import { User, SocialAccount, ActiveSession, IUser, ISocialAccount } from '../models/User.js';
import { N8nService } from './n8n.service.js';
import { AppError } from '../exceptions/AppError.js';
import { Types } from 'mongoose';

export class UserService {
    static async getProfile(userId: string): Promise<IUser> {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    static async updateProfile(userId: string, profileData: Partial<IUser>): Promise<IUser> {
        const allowedFields = ['name', 'avatar_url', 'bio', 'website', 'location', 'language', 'timezone', 'email_notifications', 'push_notifications'];
        const updateData: Partial<IUser> = {};

        Object.keys(profileData).forEach(key => {
            if (allowedFields.includes(key) && profileData[key as keyof IUser] !== undefined) {
                updateData[key as keyof IUser] = profileData[key as keyof IUser];
            }
        });

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    static async getSocialAccounts(userId: string): Promise<ISocialAccount[]> {
        return SocialAccount.find({ user_id: new Types.ObjectId(userId) });
    }

    static async connectSocialAccount(userId: string, platform: string, accountData: any): Promise<ISocialAccount> {
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
            { upsert: true, new: true, runValidators: true }
        );

        await N8nService.triggerWorkflow('sync-social-accounts', {
            userId,
            platform,
            accountId: socialAccount._id
        });

        return socialAccount;
    }

    static async disconnectSocialAccount(userId: string, platform: string): Promise<void> {
        const result = await SocialAccount.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId), platform },
            {
                is_connected: false,
                access_token: '',
                refresh_token: '',
                last_sync: new Date()
            }
        );

        if (!result) {
            throw new AppError('Social account not found', 404);
        }
    }

    static async syncSocialAccount(userId: string, platform: string): Promise<void> {
        const account = await SocialAccount.findOne({
            user_id: new Types.ObjectId(userId),
            platform,
            is_connected: true
        });

        if (!account) {
            throw new AppError('Account not found or not connected', 404);
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
        const result = await SocialAccount.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId), platform },
            { settings },
            { new: true }
        );

        if (!result) {
            throw new AppError('Social account not found', 404);
        }

        await N8nService.triggerWorkflow('update-social-settings', {
            userId,
            platform,
            settings
        });
    }

    static async getActiveSessions(userId: string): Promise<IActiveSession[]> {
        return ActiveSession.find({ user_id: new Types.ObjectId(userId) })
            .sort({ last_activity: -1 });
    }

    static async terminateSession(userId: string, sessionId: string): Promise<void> {
        const result = await ActiveSession.findOneAndDelete({
            _id: sessionId,
            user_id: new Types.ObjectId(userId)
        });

        if (!result) {
            throw new AppError('Session not found', 404);
        }
    }

    static async terminateAllSessions(userId: string, excludeSessionId?: string): Promise<void> {
        const query: any = { user_id: new Types.ObjectId(userId) };
        if (excludeSessionId) {
            query._id = { $ne: excludeSessionId };
        }

        await ActiveSession.deleteMany(query);
    }

    static async enableTwoFactor(userId: string, method: 'sms' | 'authenticator', phoneNumber?: string): Promise<IUser> {
        const updateData: any = {
            two_factor_enabled: true,
            two_factor_method: method,
            two_factor_backup_codes: this.generateBackupCodes()
        };

        if (method === 'authenticator') {
            updateData.two_factor_secret = this.generateSecret();
        } else if (method === 'sms' && phoneNumber) {
            updateData.phone_number = phoneNumber;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    static async disableTwoFactor(userId: string): Promise<IUser> {
        const user = await User.findByIdAndUpdate(
            userId,
            {
                two_factor_enabled: false,
                two_factor_method: undefined,
                two_factor_secret: undefined,
                two_factor_backup_codes: []
            },
            { new: true }
        );

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    static async createSession(userId: string, deviceInfo: string, ipAddress: string, location: string): Promise<IActiveSession> {
        const session = new ActiveSession({
            user_id: new Types.ObjectId(userId),
            device_info: deviceInfo,
            ip_address: ipAddress,
            location: location,
            last_activity: new Date()
        });
        await session.save();
        return session;
    }

    static async updateSessionActivity(sessionId: string): Promise<void> {
        await ActiveSession.findByIdAndUpdate(sessionId, {
            last_activity: new Date()
        });
    }

    private static generateBackupCodes(): string[] {
        const codes: string[] = [];
        for (let i = 0; i < 10; i++) {
            codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
        }
        return codes;
    }

    private static generateSecret(): string {
        return Math.random().toString(36).substring(2, 18);
    }
}