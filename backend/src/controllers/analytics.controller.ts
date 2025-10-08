import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { AnalyticsFilterDto } from '../dtos/analytics.dto.js';

/**
 * Контроллер для работы с аналитикой контента
 * Статистика просмотров, вовлеченности и эффективности публикаций
 */
export class AnalyticsController {
    /**
   * Получить аналитику для конкретного контента
   * req - Запрос с ID контента и фильтрами по дате
   * req.params.contentId - ID контента для анализа
   * req.query.startDate - Начальная дата периода (необязательно)
   * req.query.endDate - Конечная дата периода (необязательно)
   * res - Ответ с аналитикой контента
   * {ContentAnalytics} - Статистика просмотров, лайков, комментариев и т.д.
   */
    static async getContentAnalytics(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const { startDate, endDate } = req.query as AnalyticsFilterDto;

            const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate) : new Date();

            const analytics = await AnalyticsService.getContentAnalytics(contentId, start, end);
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch content analytics' });
        }
    }

    /**
   * Получить общую аналитику пользователя по всем контентам
   * req - Запрос с фильтрами по дате и платформе
   * req.query.startDate - Начальная дата периода анализа
   * req.query.endDate - Конечная дата периода анализа
   * req.query.platform - Фильтр по платформе (необязательно)
   * res - Ответ с общей аналитикой пользователя
   * {UserAnalytics} - Сводная статистика по всем контентам пользователя
   */
    static async getUserAnalytics(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { startDate, endDate, platform } = req.query as AnalyticsFilterDto;

            const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate) : new Date();

            const analytics = await AnalyticsService.getUserAnalytics(userId, start, end, platform);
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user analytics' });
        }
    }

    /**
   * Получить топ контента пользователя по эффективности
   * req - Запрос с фильтрами и лимитом результатов
   * req.query.startDate - Начальная дата периода
   * req.query.endDate - Конечная дата периода
   * req.query.limit - Количество результатов (по умолчанию 5)
   * res - Ответ с массивом лучшего контента
   * {ContentAnalytics[]} - Массив контента отсортированный по эффективности
   */
    static async getTopContent(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { startDate, endDate, limit } = req.query as AnalyticsFilterDto & { limit?: number };

            const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate) : new Date();
            const contentLimit = limit || 5;

            const topContent = await AnalyticsService.getTopContent(userId, start, end, contentLimit);
            res.json(topContent);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch top content' });
        }
    }

    /**
   * Сравнить эффективность контента на разных платформах
   * req - Запрос с периодом для сравнения
   * req.query.startDate - Начальная дата периода
   * req.query.endDate - Конечная дата периода
   * res - Ответ со сравнением платформ
   * {Object} - Сравнительная аналитика по платформам
   */
    static async getPlatformComparison(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { startDate, endDate } = req.query as AnalyticsFilterDto;

            const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate) : new Date();

            const comparison = await AnalyticsService.getPlatformComparison(userId, start, end);
            res.json(comparison);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch platform comparison' });
        }
    }

    /**
   * Экспортировать аналитику в CSV или JSON формате
   * req - Запрос с параметрами экспорта
   * req.query.startDate - Начальная дата периода
   * req.query.endDate - Конечная дата периода
   * req.query.platform - Фильтр по платформе
   * req.query.format - Формат экспорта: 'csv' или 'json'
   * res - Ответ с файлом экспорта или JSON данными
   * {Buffer|Object} - CSV файл или JSON данные аналитики
   */
    static async exportAnalytics(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { startDate, endDate, platform, format } = req.query as AnalyticsFilterDto & { format: 'csv' | 'json' };

            const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate) : new Date();

            const analytics = await AnalyticsService.getUserAnalytics(userId, start, end, platform);

            if (format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=analytics-${userId}-${start.toISOString()}-${end.toISOString()}.csv`);

                const csvData = this.convertToCSV(analytics);
                res.send(csvData);
            } else {
                res.json(analytics);
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to export analytics' });
        }
    }

    /**
  * Вспомогательный метод для конвертации объекта в CSV строку
  * data - Объект данных для конвертации
  * {string} - CSV строка с заголовками и значениями
  */
    private static convertToCSV(data: any): string {
        const flattenObject = (obj: any, prefix = ''): any => {
            return Object.keys(obj).reduce((acc, key) => {
                const pre = prefix.length ? prefix + '.' : '';
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    Object.assign(acc, flattenObject(obj[key], pre + key));
                } else {
                    acc[pre + key] = obj[key];
                }
                return acc;
            }, {} as any);
        };

        const flattened = flattenObject(data);
        const headers = Object.keys(flattened).join(',');
        const values = Object.values(flattened).join(',');

        return `${headers}\n${values}`;
    }
}