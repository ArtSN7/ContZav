import { Request, Response } from 'express';
import { AccountService } from '../services/account.service.js';

export class AccountController {
    /**
     * Получить информацию о текущей подписке пользователя
     * @param req - Объект запроса Express с авторизованным пользователем
     * @param res - Объект ответа Express
     * @returns {Object} Информация о подписке: тариф, срок действия, использованные лимиты
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
     * @param req - Запрос с новым ID тарифного плана в теле
     * @param req.body.planId - ID нового тарифного плана
     * @param res - Ответ с обновленной информацией о подписке
     * @returns {Object} Обновленная информация о подписке
     */
    static async updateSubscription(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { planId } = req.body;
            const subscription = await AccountService.updateSubscription(userId, planId);
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update subscription' });
        }
    }

    /**
     * Получить историю всех платежей пользователя
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ со списком платежей
     * @returns {Object[]} Массив платежей с датами, суммами и статусами
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
     * @param req - Запрос с параметрами платежа в теле
     * @param req.body.amount - Сумма платежа в числовом формате
     * @param req.body.currency - Валюта платежа (RUB, USD, EUR)
     * @param res - Ответ с информацией о созданном платеже
     * @returns {Object} Информация о созданном платеже
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
     * Запустить синхронизацию всех подключенных социальных сетей
     * Обновляет статистику подписчиков и последние посты
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с подтверждением начала синхронизации
     * @returns {Object} Сообщение о начале синхронизации
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
     * Обновить настройки для конкретной социальной сети
     * @param req - Запрос с параметрами настройки в теле
     * @param req.body.platform - Идентификатор платформы (youtube, instagram, vk и т.д.)
     * @param req.body.settings - Новые настройки в виде объекта
     * @param res - Ответ с подтверждением обновления
     * @returns {Object} Сообщение об успешном обновлении настроек
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