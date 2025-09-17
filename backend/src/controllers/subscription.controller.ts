import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service.js';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dtos/subscription.dto.js';

export class SubscriptionController {
    static async getAllPlans(req: Request, res: Response) {
        try {
            const plans = await SubscriptionService.getAllPlans();
            res.json(plans);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch subscription plans' });
        }
    }

    static async getPlan(req: Request, res: Response) {
        try {
            const { planId } = req.params;
            const plan = await SubscriptionService.getPlan(planId);
            res.json(plan);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch subscription plan' });
        }
    }

    static async createPlan(req: Request, res: Response) {
        try {
            const planData: CreateSubscriptionDto = req.body;
            const plan = await SubscriptionService.createPlan(planData);
            res.status(201).json(plan);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create subscription plan' });
        }
    }

    static async updatePlan(req: Request, res: Response) {
        try {
            const { planId } = req.params;
            const planData: UpdateSubscriptionDto = req.body;
            const plan = await SubscriptionService.updatePlan(planId, planData);
            res.json(plan);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update subscription plan' });
        }
    }

    static async deletePlan(req: Request, res: Response) {
        try {
            const { planId } = req.params;
            await SubscriptionService.deletePlan(planId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete subscription plan' });
        }
    }

    static async getUserSubscription(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const subscription = await SubscriptionService.getUserSubscription(userId);
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user subscription' });
        }
    }

    static async updateUserSubscription(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { planId } = req.body;
            const subscription = await SubscriptionService.updateUserSubscription(userId, planId);
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update user subscription' });
        }
    }

    static async cancelSubscription(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const subscription = await SubscriptionService.cancelSubscription(userId);
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: 'Failed to cancel subscription' });
        }
    }
}