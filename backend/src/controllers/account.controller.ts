import { Request, Response } from 'express';
import { AccountService } from '../services/account.service.js';

/**
 * Контроллер для управления аккаунтом пользователя
 * Отвечает за подписки, платежи и настройки социальных сетей
 */
export class AccountController {
    /**
  * Получить информацию о текущей подписке пользователя
  * req - Объект запроса Express с авторизованным пользователем
  * res - Объект ответа Express
  * {Subscription} - Информация о подписке: тариф, срок действия, использованные лимиты
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
  * req - Запрос с новым названием тарифного плана в теле
  * req.body.plan - Название нового тарифного плана (например, "pro", "business")
  * res - Ответ с обновленной информацией о подписке
  * {Subscription} - Обновленная информация о подписке
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
  * req - Запрос от авторизованного пользователя
  * res - Ответ со списком платежей
  * {PaymentHistory[]} - Массив платежей с датами, суммами и статусами
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
     * req - Запрос с параметрами платежа в теле
     * req.body.amount - Сумма платежа в числовом формате
     * req.body.currency - Валюта платежа (RUB, USD, EUR)
     * res - Ответ с информацией о созданном платеже
     * {PaymentHistory} - Информация о созданном платеже
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
  * req - Запрос от авторизованного пользователя
  * res - Ответ с подтверждением начала синхронизации
  * {Object} - Сообщение о начале синхронизации
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
  * req - Запрос с параметрами настройки в теле
  * req.body.platform - Идентификатор платформы (youtube, instagram, vk и т.д.)
  * req.body.settings - Новые настройки в виде объекта
  * res - Ответ с подтверждением обновления
  * {Object} - Сообщение об успешном обновлении настроек
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