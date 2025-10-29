import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscription.service.js';
import { AccountService } from '../services/account.service.js';
import { AppError } from '../exceptions/AppError.js';

export class SubscriptionController {
    static async getSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const subscription = await SubscriptionService.getUserSubscription(req.user.id);
            const billingHistory = await AccountService.getPaymentHistory(req.user.id);

            res.json({
                success: true,
                data: {
                    plan: subscription.plan_id?.name || 'Free',
                    price: subscription.plan_id?.price || 0,
                    billingCycle: 'monthly',
                    nextBilling: new Date(subscription.current_period_end).toLocaleDateString('ru-RU'),
                    status: subscription.status,
                    usage: {
                        videosUsed: await SubscriptionService.getCurrentUsage(req.user.id, 'content'),
                        videosLimit: subscription.plan_id?.monthly_limit || 10,
                        networksUsed: 0,
                        networksLimit: subscription.plan_id?.social_networks_limit || 3
                    },
                    billingHistory: billingHistory.map((payment: any) => ({
                        date: new Date(payment.created_at).toLocaleDateString('ru-RU'),
                        amount: payment.amount,
                        status: payment.status,
                        invoice: payment.invoice_url ? `INV-${payment._id.toString().slice(-6)}` : 'N/A'
                    }))
                }
            });
        } catch (error: any) {
            console.error('SubscriptionController error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    static async getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const plans = await SubscriptionService.getAllPlans();
            res.json({
                success: true,
                data: plans
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.params;
            const plan = await SubscriptionService.getPlan(planId);
            res.json({
                success: true,
                data: plan
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);
            const subscription = await SubscriptionService.getUserSubscription(req.user.id);
            res.json({
                success: true,
                data: subscription
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateUserSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);
            const { planId } = req.body;
            const subscription = await SubscriptionService.updateUserSubscription(req.user.id, planId);
            res.json({
                success: true,
                data: subscription,
                message: 'Subscription updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async cancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);
            const subscription = await SubscriptionService.cancelSubscription(req.user.id);
            res.json({
                success: true,
                data: subscription,
                message: 'Subscription cancelled'
            });
        } catch (error) {
            next(error);
        }
    }

    static async checkLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);
            const { feature } = req.params;
            if (feature !== 'content' && feature !== 'ai_generations') {
                throw new AppError('Invalid feature', 400);
            }
            const hasCapacity = await SubscriptionService.checkSubscriptionLimit(req.user.id, feature);
            res.json({
                success: true,
                data: { hasCapacity }
            });
        } catch (error) {
            next(error);
        }
    }

    static async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const plan = await SubscriptionService.createPlan(req.body);
            res.json({
                success: true,
                data: plan,
                message: 'Plan created successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.params;
            const plan = await SubscriptionService.updatePlan(planId, req.body);
            res.json({
                success: true,
                data: plan,
                message: 'Plan updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.params;
            await SubscriptionService.deletePlan(planId);
            res.json({
                success: true,
                message: 'Plan deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.getAllPlans(req, res, next);
    }

    static async updateSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.updateUserSubscription(req, res, next);
    }

    static async checkUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.checkLimit(req, res, next);
    }
}