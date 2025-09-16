import { AnalyticsModel } from '../models/Analytics.js';
import { UserAnalytics, ContentAnalytics } from '../types/analytics.js';

export class AnalyticsService {
    static async getContentAnalytics(contentId: string, startDate: Date, endDate: Date) {
        return AnalyticsModel.getContentAnalytics(contentId, startDate, endDate);
    }

    static async getUserAnalytics(userId: string, startDate: Date, endDate: Date, platform?: string): Promise<UserAnalytics> {
        return AnalyticsModel.getUserAnalytics(userId, startDate, endDate, platform);
    }

    static async getTopContent(userId: string, startDate: Date, endDate: Date, limit: number = 5): Promise<ContentAnalytics[]> {
        return AnalyticsModel.getTopContent(userId, startDate, endDate, limit);
    }

    static async getPlatformComparison(userId: string, startDate: Date, endDate: Date) {
        const currentPeriod = await AnalyticsModel.getUserAnalytics(userId, startDate, endDate);
        const previousStartDate = new Date(startDate);
        const previousEndDate = new Date(endDate);
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);
        previousEndDate.setMonth(previousEndDate.getMonth() - 1);

        const previousPeriod = await AnalyticsModel.getUserAnalytics(userId, previousStartDate, previousEndDate);

        return {
            current_period: currentPeriod,
            previous_period: previousPeriod,
            comparison: this.calculateComparison(currentPeriod, previousPeriod)
        };
    }

    private static calculateComparison(current: UserAnalytics, previous: UserAnalytics) {
        const calculatePercentageChange = (currentVal: number, previousVal: number) => {
            if (previousVal === 0) return currentVal > 0 ? 100 : 0;
            return ((currentVal - previousVal) / previousVal) * 100;
        };

        return {
            views_change: calculatePercentageChange(current.total_views, previous.total_views),
            reach_change: calculatePercentageChange(current.total_reach, previous.total_reach),
            engagements_change: calculatePercentageChange(current.total_engagements, previous.total_engagements),
            likes_change: calculatePercentageChange(current.total_likes, previous.total_likes),
            comments_change: calculatePercentageChange(current.total_comments, previous.total_comments),
            shares_change: calculatePercentageChange(current.total_shares, previous.total_shares),
            followers_change: calculatePercentageChange(current.total_followers_gained, previous.total_followers_gained),
            engagement_rate_change: calculatePercentageChange(current.avg_engagement_rate, previous.avg_engagement_rate),
            click_through_rate_change: calculatePercentageChange(current.avg_click_through_rate, previous.avg_click_through_rate)
        };
    }
}