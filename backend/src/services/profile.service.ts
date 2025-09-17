import { ProfileModel } from '../models/Profile.js';
import { UserProfile, TwoFactorSettings, ActiveSession } from '../types/profile.js';
import { hash, compare } from 'bcryptjs';
import { supabase } from '../services/supabase.service.js';

export class ProfileService {
    static async getProfile(userId: string): Promise<UserProfile> {
        return ProfileModel.findById(userId);
    }

    static async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
        return ProfileModel.update(userId, profileData);
    }

    static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const { data: user, error } = await supabase
            .from('users')
            .select('password_hash')
            .eq('id', userId)
            .single();

        if (error) throw new Error('User not found');

        const isPasswordValid = await compare(currentPassword, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        const newPasswordHash = await hash(newPassword, 12);

        const { error: updateError } = await supabase
            .from('users')
            .update({ password_hash: newPasswordHash })
            .eq('id', userId);

        if (updateError) throw updateError;
    }

    static async getTwoFactorSettings(userId: string): Promise<TwoFactorSettings> {
        return ProfileModel.getTwoFactorSettings(userId);
    }

    static async enableTwoFactor(userId: string, method: 'sms' | 'authenticator', phoneNumber?: string): Promise<TwoFactorSettings> {
        const settings: Partial<TwoFactorSettings> = {
            enabled: true,
            method,
            phone_number: phoneNumber || '',
            backup_codes: this.generateBackupCodes()
        };

        if (method === 'authenticator') {
            settings.secret = this.generateSecret();
        }

        return ProfileModel.updateTwoFactorSettings(userId, settings);
    }

    static async disableTwoFactor(userId: string): Promise<TwoFactorSettings> {
        return ProfileModel.updateTwoFactorSettings(userId, {
            enabled: false,
            method: null,
            phone_number: null,
            secret: null,
            backup_codes: []
        });
    }

    static async verifyPassword(userId: string, password: string): Promise<boolean> {
        const { data: user, error } = await supabase
            .from('users')
            .select('password_hash')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return compare(password, user.password_hash);
    }

    static async getActiveSessions(userId: string): Promise<ActiveSession[]> {
        return ProfileModel.getActiveSessions(userId);
    }

    static async terminateSession(userId: string, sessionId: string): Promise<void> {
        return ProfileModel.terminateSession(sessionId);
    }

    static async terminateAllSessions(userId: string): Promise<void> {
        return ProfileModel.terminateAllSessions(userId);
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