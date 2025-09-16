import { supabase } from '../services/supabase.service.js';
import { AuthUser } from '../types/index.js';

export class UserModel {
    static async findById(userId: string): Promise<AuthUser> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw new Error('User not found');
        return data as AuthUser;
    }

    static async updateProfile(userId: string, profileData: Partial<AuthUser>): Promise<AuthUser> {
        const { data, error } = await supabase
            .from('users')
            .update(profileData)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw new Error('Profile update failed');
        return data as AuthUser;
    }

    static async getSocialAccounts(userId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data;
    }
}