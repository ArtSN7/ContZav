import { Request, Response, NextFunction } from 'express';
import { AnalyticsModel } from '../models/Analytics.js';
import { AppError } from '../exceptions/AppError.js';
import { analyticsFilterSchema } from '../dtos/analytics.dto.js';

export class AnalyticsController {
    static async getContentAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const validatedData = analyticsFilterSchema.parse(req.query);
            const analytics = await AnalyticsModel.getContentAnalytics(
                req.params.contentId,
                new Date(validatedData.startDate),
                new Date(validatedData.endDate)
            );

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

            const validatedData = analyticsFilterSchema.parse(req.query);
            const period = {
                start: new Date(validatedData.startDate),
                end: new Date(validatedData.endDate),
            };

            const analytics = await AnalyticsModel.getUserAnalytics(req.user.id, period);

            res.json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            next(error);
        }
    }
}