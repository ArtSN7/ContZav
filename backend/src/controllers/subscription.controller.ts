import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service.js';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dtos/subscription.dto.js';

/**
 * Контроллер для управления подписками и тарифными планами
 * Для пользователей: выбор тарифов, управление подпиской
 * Для администраторов: создание и редактирование тарифных планов
 */
export class SubscriptionController {
    /**
  * Получить список всех доступных тарифных планов
  * req - Запрос от авторизованного пользователя
  * res - Ответ с массивом тарифных планов
  * {SubscriptionPlan[]} - Массив всех тарифных планов
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
 * req - Запрос с ID тарифного плана
 * req.params.planId - ID тарифного плана
 * res - Ответ с информацией о тарифе
 * {SubscriptionPlan} - Полная информация о тарифном плане
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
   * req - Запрос с данными нового тарифного плана
   * req.body.name - Название тарифного плана
   * req.body.price - Цена тарифа
   * req.body.features - Массив доступных функций
   * res - Ответ с созданным тарифным планом
   * {SubscriptionPlan} - Созданный тарифный план
   */
    static async createPlan(req: Request, res: Response) {
        try {
            const planData: CreateSubscriptionDto = req.body;
            const plan = await SubscriptionService.createPlan(planData);
            res.status(201).json(plan);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create subscription plan' });
        }
    }

    /**
  * Обновить существующий тарифный план (только для администраторов)
  * req - Запрос с ID плана и новыми данными
  * req.params.planId - ID тарифного плана для обновления
  * req.body - Новые данные тарифного плана
  * res - Ответ с обновленным тарифным планом
  * {SubscriptionPlan} - Обновленный тарифный план
  */
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

    /**
  * Удалить тарифный план (только для администраторов)
  * req - Запрос с ID плана для удаления
  * req.params.planId - ID тарифного плана для удаления
  * res - Ответ с подтверждением удаления
  * {Object} - Сообщение об успешном удалении тарифного плана
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
   * req - Запрос от авторизованного пользователя
   * res - Ответ с информацией о подписке
   * {UserSubscription} - Текущая подписка пользователя
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
  * req - Запрос с новым ID тарифного плана
  * req.body.planId - ID нового тарифного плана
  * res - Ответ с обновленной подпиской
  * {UserSubscription} - Обновленная подписка пользователя
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
   * req - Запрос от авторизованного пользователя
   * res - Ответ с обновленной подпиской
   * {UserSubscription} - Подписка с статусом "отменена"
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
}