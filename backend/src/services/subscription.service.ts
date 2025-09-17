import { SubscriptionModel } from '../models/Subscription.js';
import { SubscriptionPlan, UserSubscription } from '../types/subscription.js';

export class SubscriptionService {
    static async getAllPlans(): Promise<SubscriptionPlan[]> {
        return SubscriptionModel.findAll();
    }

    static async getPlan(planId: string): Promise<SubscriptionPlan> {
        return SubscriptionModel.findById(planId);
    }

    static async createPlan(planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
        return SubscriptionModel.create(planData);
    }

    static async updatePlan(planId: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
        return SubscriptionModel.update(planId, planData);
    }

    static async deletePlan(planId: string): Promise<void> {
        return SubscriptionModel.delete(planId);
    }

    static async getUserSubscription(userId: string): Promise<UserSubscription> {
        return SubscriptionModel.getUserSubscription(userId);
    }

    static async updateUserSubscription(userId: string, planId: string): Promise<UserSubscription> {
        const plan = await SubscriptionModel.findById(planId);
        return SubscriptionModel.updateUserSubscription(userId, {
            plan_id: planId,
            current_usage: 0,
            current_social_networks: 0,
            status: 'active'
        });
    }

    static async cancelSubscription(userId: string): Promise<UserSubscription> {
        return SubscriptionModel.updateUserSubscription(userId, {
            status: 'canceled'
        });
    }
}