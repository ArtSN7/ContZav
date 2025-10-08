import { UserProfile, TwoFactorSettings, ActiveSession } from '../models/Profile.js';
import { User } from '../models/User.js';
import { hash, compare } from 'bcryptjs';
import { Types } from 'mongoose';

export class ProfileService {
    static async getProfile(userId: string): Promise<any> {
        const profile = await UserProfile.findOne({ user_id: new Types.ObjectId(userId) });
        if (!profile) {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            const newProfile = new UserProfile({
                user_id: user._id,
                name: user.name,
                avatar_url: user.avatar_url,
                language: 'ru',
                timezone: 'Europe/Moscow'
            });
            await newProfile.save();
            return newProfile;
        }
        return profile;
    }

    static async updateProfile(userId: string, profileData: any): Promise<any> {
        const profile = await UserProfile.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId) },
            profileData,
            { new: true, upsert: true }
        );

        await User.findByIdAndUpdate(userId, {
            name: profileData.name,
            avatar_url: profileData.avatar_url
        });

        return profile;
    }

    static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        user.password_hash = newPassword;
        await user.save();
    }

    static async getTwoFactorSettings(userId: string): Promise<any> {
        const settings = await TwoFactorSettings.findOne({ user_id: new Types.ObjectId(userId) });
        if (!settings) {
            const newSettings = new TwoFactorSettings({
                user_id: new Types.ObjectId(userId),
                enabled: false,
                backup_codes: []
            });
            await newSettings.save();
            return newSettings;
        }
        return settings;
    }

    static async enableTwoFactor(userId: string, method: 'sms' | 'authenticator', phoneNumber?: string): Promise<any> {
        const settings: any = {
            enabled: true,
            method,
            phone_number: phoneNumber || '',
            backup_codes: this.generateBackupCodes()
        };

        if (method === 'authenticator') {
            settings.secret = this.generateSecret();
        }

        const twoFactorSettings = await TwoFactorSettings.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId) },
            settings,
            { new: true, upsert: true }
        );
        return twoFactorSettings;
    }

    static async disableTwoFactor(userId: string): Promise<any> {
        const twoFactorSettings = await TwoFactorSettings.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId) },
            {
                enabled: false,
                method: null,
                phone_number: null,
                secret: null,
                backup_codes: []
            },
            { new: true }
        );
        return twoFactorSettings;
    }

    static async verifyPassword(userId: string, password: string): Promise<boolean> {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        return user.comparePassword(password);
    }

    static async getActiveSessions(userId: string): Promise<any[]> {
        return ActiveSession.find({ user_id: new Types.ObjectId(userId) })
            .sort({ last_activity: -1 });
    }

    static async createSession(userId: string, deviceInfo: string, ipAddress: string, location: string): Promise<any> {
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

    static async terminateSession(sessionId: string): Promise<void> {
        await ActiveSession.findByIdAndDelete(sessionId);
    }

    static async terminateAllSessions(userId: string): Promise<void> {
        await ActiveSession.deleteMany({ user_id: new Types.ObjectId(userId) });
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