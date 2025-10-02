import { Request, Response } from 'express';
import { AccountService } from '../services/account.service.js';

/**
 * Управление аккаунтом пользователя: подписки, платежи и соцсети
 * Здесь обрабатываются все запросы связанные с настройками аккаунта
 */

export class AccountController {
/**
   * Получить информацию о текущей подписке пользователя
   * Показывает какой тариф активен, когда заканчивается и сколько контента использовано
   */
    static async getSubscription(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const subscription = await AccountService.getSubscription(userId);
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch subscription' });
        }
    }

/**
   * Изменить тарифный план пользователя
   * Например, перейти с "Базового" на "Про" тариф
   * @body {string} plan - название нового тарифного плана
   */
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

  /**
   * Получить историю всех платежей пользователя
   * Показывает когда, сколько и за что были списаны деньги
   */
    static async getPaymentHistory(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const payments = await AccountService.getPaymentHistory(userId);
            res.json(payments);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch payment history' });
        }
    }

/**
   * Создать новый платеж (например, для пополнения баланса)
   * @body {number} amount - сумма платежа
   * @body {string} currency - валюта (RUB, USD и т.д.)
   */
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

  /**
   * Запустить синхронизацию всех подключенных соцсетей
   * Система обновит статистику подписчиков и последние посты
   */
    static async syncSocialAccounts(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            await AccountService.syncSocialAccounts(userId);
            res.json({ message: 'Social accounts sync started' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to sync social accounts' });
        }
    }

/**
   * Обновить настройки для конкретной соцсети
   * Например, включить/выключить авто-публикацию для YouTube
   * @body {string} platform - какая соцсеть (youtube, instagram и т.д.)
   * @body {object} settings - новые настройки
   */
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