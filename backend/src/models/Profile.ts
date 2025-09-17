import { supabase } from '../services/supabase.service.js';
import { UserProfile, TwoFactorSettings, ActiveSession, Subscription, PaymentHistory } from '../types/profile.js';

export class ProfileModel {
    static async findById(userId: string): Promise<UserProfile> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data as UserProfile;
    }

    static async update(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as UserProfile;
    }

    static async getTwoFactorSettings(userId: string): Promise<TwoFactorSettings> {
        const { data, error } = await supabase
            .from('two_factor_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data as TwoFactorSettings;
    }

    static async updateTwoFactorSettings(userId: string, settings: Partial<TwoFactorSettings>): Promise<TwoFactorSettings> {
        const { data, error } = await supabase
            .from('two_factor_settings')
            .upsert({ user_id: userId, ...settings })
            .select()
            .single();

        if (error) throw error;
        return data as TwoFactorSettings;
    }

    static async updatePassword(userId: string, passwordHash: string): Promise<void> {
        const { error } = await supabase
            .from('users')
            .update({ password_hash: passwordHash })
            .eq('id', userId);

        if (error) throw error;
    }

    static async getActiveSessions(userId: string): Promise<ActiveSession[]> {
        const { data, error } = await supabase
            .from('active_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('last_activity', { ascending: false });

        if (error) throw error;
        return data as ActiveSession[];
    }

    static async terminateSession(sessionId: string): Promise<void> {
        const { error } = await supabase
            .from('active_sessions')
            .delete()
            .eq('id', sessionId);

        if (error) throw error;
    }

    static async terminateAllSessions(userId: string): Promise<void> {
        const { error } = await supabase
            .from('active_sessions')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
    }
}