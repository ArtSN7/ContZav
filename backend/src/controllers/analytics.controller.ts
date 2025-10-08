import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
    /**
     * Получить аналитику для конкретного контента
     * @param req - Запрос с ID контента и фильтрами по дате
     * @param req.params.contentId - ID контента для анализа
     * @param req.query.startDate - Начальная дата периода (необязательно)
     * @param req.query.endDate - Конечная дата периода (необязательно)
     * @param res - Ответ с аналитикой контента
     * @returns {Object} Статистика просмотров, лайков, комментариев и т.д.
     */
    static async getContentAnalytics(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const { startDate, endDate } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const analytics = await AnalyticsService.getContentAnalytics(contentId, start, end);
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch content analytics' });
        }
    }

    /**
     * Получить общую аналитику пользователя по всем контентам
     * @param req - Запрос с фильтрами по дате и платформе
     * @param req.query.startDate - Начальная дата периода анализа
     * @param req.query.endDate - Конечная дата периода анализа
     * @param req.query.platform - Фильтр по платформе (необязательно)
     * @param res - Ответ с общей аналитикой пользователя
     * @returns {Object} Сводная статистика по всем контентам пользователя
     */
    static async getUserAnalytics(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { startDate, endDate, platform } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const analytics = await AnalyticsService.getUserAnalytics(userId, start, end, platform as string);
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user analytics' });
        }
    }

    /**
     * Получить топ контента пользователя по эффективности
     * @param req - Запрос с фильтрами и лимитом результатов
     * @param req.query.startDate - Начальная дата периода
     * @param req.query.endDate - Конечная дата периода
     * @param req.query.limit - Количество результатов (по умолчанию 5)
     * @param res - Ответ с массивом лучшего контента
     * @returns {Object[]} Массив контента отсортированный по эффективности
     */
    static async getTopContent(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { startDate, endDate, limit } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();
            const contentLimit = limit ? parseInt(limit as string) : 5;

            const topContent = await AnalyticsService.getTopContent(userId, start, end, contentLimit);
            res.json(topContent);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch top content' });
        }
    }

    /**
     * Сравнить эффективность контента на разных платформах
     * @param req - Запрос с периодом для сравнения
     * @param req.query.startDate - Начальная дата периода
     * @param req.query.endDate - Конечная дата периода
     * @param res - Ответ со сравнением платформ
     * @returns {Object} Сравнительная аналитика по платформам
     */
    static async getPlatformComparison(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { startDate, endDate } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const comparison = await AnalyticsService.getPlatformComparison(userId, start, end);
            res.json(comparison);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch platform comparison' });
        }
    }

    /**
     * Экспортировать аналитику в CSV или JSON формате
     * @param req - Запрос с параметрами экспорта
     * @param req.query.startDate - Начальная дата периода
     * @param req.query.endDate - Конечная дата периода
     * @param req.query.platform - Фильтр по платформе
     * @param req.query.format - Формат экспорта: 'csv' или 'json'
     * @param res - Ответ с файлом экспорта или JSON данными
     * @returns {Buffer|Object} CSV файл или JSON данные аналитики
     */
    static async exportAnalytics(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { startDate, endDate, platform, format } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const analytics = await AnalyticsService.getUserAnalytics(userId, start, end, platform as string);

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
     * Получить статистику по подписчикам и публикациям
     * @param req - Запрос с периодом для статистики
     * @param req.query.startDate - Начальная дата периода
     * @param req.query.endDate - Конечная дата периода
     * @param req.query.platform - Фильтр по платформе
     * @param res - Ответ со статистикой
     * @returns {Object[]} Статистика по подписчикам и публикациям
     */
    static async getStatistics(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { startDate, endDate, platform } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const statistics = await AnalyticsService.getStatistics(userId, start, end, platform as string);
            res.json(statistics);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch statistics' });
        }
    }

    /**
     * Вспомогательный метод для конвертации объекта в CSV строку
     * @param data - Объект данных для конвертации
     * @returns {string} CSV строка с заголовками и значениями
     */
    private static convertToCSV(data: any): string {
        const flattenObject = (obj: any, prefix = ''): any => {
            return Object.keys(obj).reduce((acc, key) => {
                const pre = prefix.length ? prefix + '.' : '';
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
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