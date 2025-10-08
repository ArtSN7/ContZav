import { SubscriptionPlan, UserSubscription } from '../models/Subscription.js';
import { Types } from 'mongoose';

export class SubscriptionService {
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

    static async getUserSubscription(userId: string): Promise<any> {
        const subscription = await UserSubscription.findOne({ user_id: new Types.ObjectId(userId) })
            .populate('plan_id');

        if (!subscription) {
            const freePlan = await SubscriptionPlan.findOne({ price: 0 });
            if (!freePlan) throw new Error('Free plan not found');

            const newSubscription = new UserSubscription({
                user_id: new Types.ObjectId(userId),
                plan_id: freePlan._id,
                status: 'active',
                current_period_start: new Date(),
                current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            });
            await newSubscription.save();
            await newSubscription.populate('plan_id');
            return newSubscription;
        }

        return subscription;
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

    static async getCurrentUsage(userId: string, feature: 'content' | 'ai_generations'): Promise<number> {
        const currentPeriodStart = new Date();
        currentPeriodStart.setDate(1);

        if (feature === 'content') {
            const Content = (await import('../models/Content.js')).Content;
            return Content.countDocuments({
                user_id: new Types.ObjectId(userId),
                created_at: { $gte: currentPeriodStart }
            });
        } else {
            const AIGenerationRequest = (await import('../models/AIGeneration.js')).AIGenerationRequest;
            return AIGenerationRequest.countDocuments({
                user_id: new Types.ObjectId(userId),
                created_at: { $gte: currentPeriodStart }
            });
        }
    }
}