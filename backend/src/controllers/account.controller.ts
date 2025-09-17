import { Request, Response } from 'express';
import { AccountService } from '../services/account.service.js';

export class AccountController {
    static async getSubscription(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const subscription = await AccountService.getSubscription(userId);
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch subscription' });
        }
    }

    static async updateSubscription(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { plan } = req.body;
            const subscription = await AccountService.updateSubscription(userId, plan);
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update subscription' });
        }
    }

    static async getPaymentHistory(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const payments = await AccountService.getPaymentHistory(userId);
            res.json(payments);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch payment history' });
        }
    }

    static async createPayment(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { amount, currency } = req.body;
            const payment = await AccountService.createPayment(userId, amount, currency);
            res.json(payment);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create payment' });
        }
    }

    static async syncSocialAccounts(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            await AccountService.syncSocialAccounts(userId);
            res.json({ message: 'Social accounts sync started' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to sync social accounts' });
        }
    }

    static async updateSocialSettings(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { platform, settings } = req.body;
            await AccountService.updateSocialSettings(userId, platform, settings);
            res.json({ message: 'Social settings updated' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update social settings' });
        }
    }
}