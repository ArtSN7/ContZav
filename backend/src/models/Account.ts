import { supabase } from '../services/supabase.service.js';
import { Subscription, PaymentHistory } from '../types/profile.js';

export class AccountModel {
    static async getSubscription(userId: string): Promise<Subscription> {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data as Subscription;
    }

    static async updateSubscription(userId: string, plan: string): Promise<Subscription> {
        const { data, error } = await supabase
            .from('subscriptions')
            .update({ plan })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as Subscription;
    }

    static async getPaymentHistory(userId: string): Promise<PaymentHistory[]> {
        const { data, error } = await supabase
            .from('payment_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as PaymentHistory[];
    }

    static async createPaymentRecord(userId: string, paymentData: Partial<PaymentHistory>): Promise<PaymentHistory> {
        const { data, error } = await supabase
            .from('payment_history')
            .insert([{ user_id: userId, ...paymentData }])
            .select()
            .single();

        if (error) throw error;
        return data as PaymentHistory;
    }
}