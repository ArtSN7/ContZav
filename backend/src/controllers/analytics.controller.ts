import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { AppError } from '../exceptions/AppError.js';

export class AnalyticsController {
    static async getContentAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { contentId } = req.params;
            const { startDate, endDate } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const analytics = await AnalyticsService.getContentAnalytics(contentId, start, end);

            res.json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { startDate, endDate, platform } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const analytics = await AnalyticsService.getUserAnalytics(req.user.id, start, end, platform as string);

            res.json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTopContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { startDate, endDate, limit } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();
            const contentLimit = limit ? parseInt(limit as string) : 5;

            const topContent = await AnalyticsService.getTopContent(req.user.id, start, end, contentLimit);

            res.json({
                success: true,
                data: topContent,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPlatformComparison(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { startDate, endDate } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const comparison = await AnalyticsService.getPlatformComparison(req.user.id, start, end);

            res.json({
                success: true,
                data: comparison,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { startDate, endDate, platform } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const statistics = await AnalyticsService.getStatistics(req.user.id, start, end, platform as string);

            const aggregatedStats = {
                totalViews: statistics.reduce((sum, stat) => sum + (stat.views_count || 0), 0),
                totalEngagements: statistics.reduce((sum, stat) => sum + (stat.reactions_count || 0), 0),
                engagementRate: 24.5,
                followersCount: statistics.reduce((sum, stat) => sum + (stat.followers_count || 0), 0),
                postsCount: statistics.reduce((sum, stat) => sum + (stat.posts_count || 0), 0),
                videosCount: statistics.reduce((sum, stat) => sum + (stat.videos_count || 0), 0)
            };

            res.json({
                success: true,
                data: aggregatedStats,
            });
        } catch (error) {
            next(error);
        }
    }

    static async exportAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const { format, startDate, endDate } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            const analytics = await AnalyticsService.getUserAnalytics(req.user.id, start, end);

            res.json({
                success: true,
                data: {
                    downloadUrl: `/api/analytics/export/${Date.now()}.${format || 'json'}`,
                    format: format || 'json',
                    period: { start, end }
                },
            });
        } catch (error) {
            next(error);
        }
    }
}