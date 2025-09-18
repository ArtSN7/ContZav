import { supabase } from '../services/supabase.service.js';
import { AuthUser, SocialAccount } from '../types/index.js';

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

    static async findByEmail(email: string): Promise<AuthUser | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) return null;
        return data as AuthUser;
    }

    static async create(userData: Partial<AuthUser>): Promise<AuthUser> {
        const completeUserData = {
            ...userData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('users')
            .insert([completeUserData])
            .select()
            .single();

        if (error) {
            console.error('User creation error:', error);
            throw new Error('User creation failed: ' + error.message);
        }
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

    static async getSocialAccounts(userId: string): Promise<SocialAccount[]> {
        const { data, error } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data as SocialAccount[];
    }

    static async upsertSocialAccount(accountData: Partial<SocialAccount>): Promise<SocialAccount> {
        const completeAccountData = {
            ...accountData,
            expires_at: accountData.expires_at ? new Date(accountData.expires_at).toISOString() : null,
            updated_at: new Date().toISOString()
        };

        const existingAccount = await supabase
            .from('social_accounts')
            .select('*')
            .eq('user_id', accountData.user_id)
            .eq('platform', accountData.platform)
            .single();

        let data, error;

        if (existingAccount.data) {
            ({ data, error } = await supabase
                .from('social_accounts')
                .update(completeAccountData)
                .eq('user_id', accountData.user_id)
                .eq('platform', accountData.platform)
                .select()
                .single());
        } else {
            completeAccountData.created_at = new Date().toISOString();
            ({ data, error } = await supabase
                .from('social_accounts')
                .insert([completeAccountData])
                .select()
                .single());
        }

        if (error) {
            console.error('Social account upsert error:', error);
            throw new Error('Social account upsert failed: ' + error.message);
        }
        return data as SocialAccount;
    }

    static async findSocialAccount(platform: string, platformUserId: string): Promise<SocialAccount | null> {
        const { data, error } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('platform', platform)
            .eq('platform_user_id', platformUserId)
            .single();

        if (error) return null;
        return data as SocialAccount;
    }
}