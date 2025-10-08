import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service.js';

export class SubscriptionController {
    /**
     * Получить список всех доступных тарифных планов
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с массивом тарифных планов
     * @returns {Object[]} Массив всех тарифных планов
     */
    static async getAllPlans(req: Request, res: Response) {
        try {
            const plans = await SubscriptionService.getAllPlans();
            res.json(plans);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch subscription plans' });
        }
    }

    /**
     * Получить информацию о конкретном тарифном плане
     * @param req - Запрос с ID тарифного плана
     * @param req.params.planId - ID тарифного плана
     * @param res - Ответ с информацией о тарифе
     * @returns {Object} Полная информация о тарифном плане
     */
    static async getPlan(req: Request, res: Response) {
        try {
            const { planId } = req.params;
            const plan = await SubscriptionService.getPlan(planId);
            res.json(plan);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch subscription plan' });
        }
    }

    /**
     * Создать новый тарифный план (только для администраторов)
     * @param req - Запрос с данными нового тарифного плана
     * @param req.body.name - Название тарифного плана
     * @param req.body.price - Цена тарифа
     * @param req.body.features - Массив доступных функций
     * @param res - Ответ с созданным тарифным планом
     * @returns {Object} Созданный тарифный план
     */
    static async createPlan(req: Request, res: Response) {
        try {
            const planData = req.body;
            const plan = await SubscriptionService.createPlan(planData);
            res.status(201).json(plan);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create subscription plan' });
        }
    }

    /**
     * Обновить существующий тарифный план (только для администраторов)
     * @param req - Запрос с ID плана и новыми данными
     * @param req.params.planId - ID тарифного плана для обновления
     * @param req.body - Новые данные тарифного плана
     * @param res - Ответ с обновленным тарифным планом
     * @returns {Object} Обновленный тарифный план
     */
    static async updatePlan(req: Request, res: Response) {
        try {
            const { planId } = req.params;
            const planData = req.body;
            const plan = await SubscriptionService.updatePlan(planId, planData);
            res.json(plan);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update subscription plan' });
        }
    }

    /**
     * Удалить тарифный план (только для администраторов)
     * @param req - Запрос с ID плана для удаления
     * @param req.params.planId - ID тарифного плана для удаления
     * @param res - Ответ с подтверждением удаления
     * @returns {Object} Сообщение об успешном удалении тарифного плана
     */
    static async deletePlan(req: Request, res: Response) {
        try {
            const { planId } = req.params;
            await SubscriptionService.deletePlan(planId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete subscription plan' });
        }
    }

    /**
     * Получить информацию о текущей подписке пользователя
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с информацией о подписке
     * @returns {Object} Текущая подписка пользователя
     */
    static async getUserSubscription(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const subscription = await SubscriptionService.getUserSubscription(userId);
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user subscription' });
        }
    }

    /**
     * Изменить тарифный план пользователя
     * @param req - Запрос с новым ID тарифного плана
     * @param req.body.planId - ID нового тарифного плана
     * @param res - Ответ с обновленной подпиской
     * @returns {Object} Обновленная подписка пользователя
     */
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

    /**
     * Отменить подписку пользователя
     * Подписка остается активной до конца оплаченного периода
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с обновленной подпиской
     * @returns {Object} Подписка с статусом "отменена"
     */
    static async cancelSubscription(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const subscription = await SubscriptionService.cancelSubscription(userId);
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: 'Failed to cancel subscription' });
        }
    }

    /**
     * Проверить лимиты использования для текущей подписки
     * @param req - Запрос с типом лимита для проверки
     * @param req.params.feature - Тип лимита: 'content' или 'ai_generations'
     * @param res - Ответ с информацией о доступности лимита
     * @returns {Object} Информация о доступности лимита
     */
    static async checkLimit(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { feature } = req.params as { feature: 'content' | 'ai_generations' };
            const hasLimit = await SubscriptionService.checkSubscriptionLimit(userId, feature);
            res.json({ hasLimit });
        } catch (error) {
            res.status(500).json({ error: 'Failed to check subscription limit' });
        }
    }
}