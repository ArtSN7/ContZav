import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { AnalyticsFilterDto } from '../dtos/analytics.dto.js';

export class AnalyticsController {
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