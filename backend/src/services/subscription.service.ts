import { SubscriptionPlan, UserSubscription } from '../models/Subscription.js';
import { Types } from 'mongoose';

export class SubscriptionService {
    static async getUserSubscription(userId: string): Promise<any> {
        try {
            let subscription = await UserSubscription.findOne({
                user_id: new Types.ObjectId(userId)
            }).populate('plan_id');

            if (!subscription) {
                let freePlan = await SubscriptionPlan.findOne({ is_active: true }).sort({ price: 1 });

                if (!freePlan) {
                    freePlan = new SubscriptionPlan({
                        name: 'Free',
                        price: 0,
                        currency: 'RUB',
                        monthly_limit: 10,
                        social_networks_limit: 3,
                        max_content: 10,
                        max_ai_generations: 5,
                        features: ['basic_content', 'ai_avatar'],
                        is_active: true
                    });
                    await freePlan.save();
                }

                subscription = new UserSubscription({
                    user_id: new Types.ObjectId(userId),
                    plan_id: freePlan._id,
                    status: 'active',
                    current_period_start: new Date(),
                    current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                });
                await subscription.save();
                await subscription.populate('plan_id');
            }

            return subscription;
        } catch (error: any) {
            console.error('SubscriptionService.getUserSubscription error:', error);
            throw error;
        }
    }

    static async getCurrentUsage(userId: string, feature: 'content' | 'ai_generations'): Promise<number> {
        return 0;
    }

    static async getAllPlans(): Promise<any[]> {
        return SubscriptionPlan.find({ is_active: true }).sort({ price: 1 });
    }

    static async getPlan(planId: string): Promise<any> {
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) throw new Error('Plan not found');
        return plan;
    }

    static async createPlan(planData: any): Promise<any> {
        const plan = new SubscriptionPlan(planData);
        await plan.save();
        return plan;
    }

    static async updatePlan(planId: string, planData: any): Promise<any> {
        const plan = await SubscriptionPlan.findByIdAndUpdate(
            planId,
            planData,
            { new: true }
        );
        if (!plan) throw new Error('Plan not found');
        return plan;
    }

    static async deletePlan(planId: string): Promise<void> {
        const result = await SubscriptionPlan.findByIdAndDelete(planId);
        if (!result) throw new Error('Plan not found');
    }

    static async updateUserSubscription(userId: string, planId: string): Promise<any> {
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) throw new Error('Plan not found');

        const subscription = await UserSubscription.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId) },
            {
                plan_id: new Types.ObjectId(planId),
                status: 'active',
                current_period_start: new Date(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            { new: true, upsert: true }
        ).populate('plan_id');

        return subscription;
    }

    static async cancelSubscription(userId: string): Promise<any> {
        const subscription = await UserSubscription.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId) },
            {
                status: 'canceled',
                cancel_at_period_end: true
            },
            { new: true }
        ).populate('plan_id');

        if (!subscription) throw new Error('Subscription not found');
        return subscription;
    }

    static async checkSubscriptionLimit(userId: string, feature: 'content' | 'ai_generations'): Promise<boolean> {
        const subscription = await this.getUserSubscription(userId);
        const usage = await this.getCurrentUsage(userId, feature);

        const limit = feature === 'content' ?
            subscription.plan_id.max_content :
            subscription.plan_id.max_ai_generations;

        return usage < limit;
    }
}