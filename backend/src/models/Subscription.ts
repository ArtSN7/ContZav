import { supabase } from '../services/supabase.service.js';
import { SubscriptionPlan, UserSubscription } from '../types/subscription.js';

export class SubscriptionModel {
    static async findAll(): Promise<SubscriptionPlan[]> {
        const { data, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .order('price', { ascending: true });

        if (error) throw error;
        return data as SubscriptionPlan[];
    }

    static async findById(planId: string): Promise<SubscriptionPlan> {
        const { data, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (error) throw error;
        return data as SubscriptionPlan;
    }

    static async create(planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
        const { data, error } = await supabase
            .from('subscription_plans')
            .insert([planData])
            .select()
            .single();

        if (error) throw error;
        return data as SubscriptionPlan;
    }

    static async update(planId: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
        const { data, error } = await supabase
            .from('subscription_plans')
            .update(planData)
            .eq('id', planId)
            .select()
            .single();

        if (error) throw error;
        return data as SubscriptionPlan;
    }

    static async delete(planId: string): Promise<void> {
        const { error } = await supabase
            .from('subscription_plans')
            .delete()
            .eq('id', planId);

        if (error) throw error;
    }

    static async getUserSubscription(userId: string): Promise<UserSubscription> {
        const { data, error } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data as UserSubscription;
    }

    static async updateUserSubscription(userId: string, subscriptionData: Partial<UserSubscription>): Promise<UserSubscription> {
        const { data, error } = await supabase
            .from('user_subscriptions')
            .update(subscriptionData)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as UserSubscription;
    }
}