import { AnalyticsData, UserAnalytics, Statistics } from '../models/Analytics.js';
import { Content } from '../models/Content.js';
import { Types } from 'mongoose';

export class AnalyticsService {
    static async getContentAnalytics(contentId: string, startDate: Date, endDate: Date): Promise<any[]> {
        const analytics = await AnalyticsData.find({
            content_id: new Types.ObjectId(contentId),
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });
        return analytics;
    }

    static async getUserAnalytics(userId: string, startDate: Date, endDate: Date, platform?: string): Promise<any> {
        const contentQuery: any = { user_id: new Types.ObjectId(userId) };
        if (platform && platform !== 'all') {
            contentQuery.platform = platform;
        }

        const userContent = await Content.find(contentQuery).select('_id title content_type platform');

        if (!userContent || userContent.length === 0) {
            return this.getEmptyUserAnalytics();
        }

        const contentIds = userContent.map(c => c._id);

        const analyticsData = await AnalyticsData.find({
            content_id: { $in: contentIds },
            date: { $gte: startDate, $lte: endDate }
        });

        const aggregatedData = this.aggregateAnalyticsData(analyticsData, userContent);
        const platformBreakdown = this.calculatePlatformBreakdown(analyticsData, userContent);
        const demographicData = await this.getDemographicData(userId);

        return {
            ...aggregatedData,
            platform_breakdown: platformBreakdown,
            demographic_data: demographicData
        };
    }

    static async getTopContent(userId: string, startDate: Date, endDate: Date, limit: number = 5): Promise<any[]> {
        const userContent = await Content.find({ user_id: new Types.ObjectId(userId) })
            .select('_id title content_type platform');

        if (!userContent || userContent.length === 0) return [];

        const contentIds = userContent.map(c => c._id);

        const analyticsData = await AnalyticsData.find({
            content_id: { $in: contentIds },
            date: { $gte: startDate, $lte: endDate }
        });

        const contentMap = new Map(userContent.map(c => [c._id.toString(), c]));
        const contentAnalytics: Map<string, any> = new Map();

        analyticsData.forEach(analytics => {
            const content = contentMap.get(analytics.content_id.toString());
            if (!content) return;

            const contentIdStr = analytics.content_id.toString();
            if (!contentAnalytics.has(contentIdStr)) {
                contentAnalytics.set(contentIdStr, {
                    content_id: contentIdStr,
                    title: content.title,
                    content_type: content.content_type,
                    platform: content.platform,
                    total_views: 0,
                    total_reach: 0,
                    total_engagements: 0,
                    total_likes: 0,
                    total_comments: 0,
                    total_shares: 0,
                    engagement_rate: 0,
                    click_through_rate: 0,
                    followers_gained: 0
                });
            }

            const current = contentAnalytics.get(contentIdStr)!;
            current.total_views += analytics.views || 0;
            current.total_reach += analytics.reach || 0;
            current.total_engagements += analytics.engagements || 0;
            current.total_likes += analytics.likes || 0;
            current.total_comments += analytics.comments || 0;
            current.total_shares += analytics.shares || 0;
            current.followers_gained += analytics.followers_gained || 0;
        });

        const topContent = Array.from(contentAnalytics.values())
            .map(item => ({
                ...item,
                engagement_rate: item.total_reach > 0 ? (item.total_engagements / item.total_reach) * 100 : 0,
                click_through_rate: item.total_views > 0 ? (item.total_engagements / item.total_views) * 100 : 0
            }))
            .sort((a, b) => b.total_engagements - a.total_engagements)
            .slice(0, limit);

        return topContent;
    }

    static async getPlatformComparison(userId: string, startDate: Date, endDate: Date): Promise<any> {
        const currentPeriod = await this.getUserAnalytics(userId, startDate, endDate);
        const previousStartDate = new Date(startDate);
        const previousEndDate = new Date(endDate);
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);
        previousEndDate.setMonth(previousEndDate.getMonth() - 1);

        const previousPeriod = await this.getUserAnalytics(userId, previousStartDate, previousEndDate);

        return {
            current_period: currentPeriod,
            previous_period: previousPeriod,
            comparison: this.calculateComparison(currentPeriod, previousPeriod)
        };
    }

    static async updateStatistics(userId: string, platform: string, stats: {
        followers_count?: number;
        views_count?: number;
        reactions_count?: number;
        posts_count?: number;
        videos_count?: number;
    }): Promise<void> {
        await Statistics.findOneAndUpdate(
            {
                user_id: new Types.ObjectId(userId),
                platform,
                date: new Date().toISOString().split('T')[0]
            },
            {
                ...stats,
                date: new Date()
            },
            { upsert: true }
        );
    }

    static async getStatistics(userId: string, startDate: Date, endDate: Date, platform?: string): Promise<any[]> {
        const query: any = {
            user_id: new Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate }
        };

        if (platform && platform !== 'all') {
            query.platform = platform;
        }

        return Statistics.find(query).sort({ date: 1 });
    }

    private static aggregateAnalyticsData(analyticsData: any[], userContent: any[]): any {
        const aggregated: any = {
            total_views: 0,
            total_reach: 0,
            total_engagements: 0,
            total_likes: 0,
            total_comments: 0,
            total_shares: 0,
            total_followers_gained: 0,
            avg_engagement_rate: 0,
            avg_click_through_rate: 0,
            top_content: [],
            platform_breakdown: [],
            demographic_data: {
                age_groups: [],
                genders: [],
                locations: []
            }
        };

        analyticsData.forEach(analytics => {
            aggregated.total_views += analytics.views || 0;
            aggregated.total_reach += analytics.reach || 0;
            aggregated.total_engagements += analytics.engagements || 0;
            aggregated.total_likes += analytics.likes || 0;
            aggregated.total_comments += analytics.comments || 0;
            aggregated.total_shares += analytics.shares || 0;
            aggregated.total_followers_gained += analytics.followers_gained || 0;
        });

        if (aggregated.total_reach > 0) {
            aggregated.avg_engagement_rate = (aggregated.total_engagements / aggregated.total_reach) * 100;
        }

        if (aggregated.total_views > 0) {
            aggregated.avg_click_through_rate = (aggregated.total_engagements / aggregated.total_views) * 100;
        }

        aggregated.top_content = this.getTopContentFromData(analyticsData, userContent, 5);

        return aggregated;
    }

    private static calculatePlatformBreakdown(analyticsData: any[], userContent: any[]): any[] {
        const platformMap = new Map<string, any>();
        const contentMap = new Map(userContent.map(c => [c._id.toString(), c]));

        analyticsData.forEach(analytics => {
            const content = contentMap.get(analytics.content_id.toString());
            if (!content) return;

            const platform = content.platform;
            if (!platformMap.has(platform)) {
                platformMap.set(platform, {
                    platform,
                    views: 0,
                    reach: 0,
                    engagements: 0,
                    likes: 0,
                    comments: 0,
                    shares: 0,
                    engagement_rate: 0
                });
            }

            const current = platformMap.get(platform)!;
            current.views += analytics.views || 0;
            current.reach += analytics.reach || 0;
            current.engagements += analytics.engagements || 0;
            current.likes += analytics.likes || 0;
            current.comments += analytics.comments || 0;
            current.shares += analytics.shares || 0;
        });

        return Array.from(platformMap.values()).map(platform => ({
            ...platform,
            engagement_rate: platform.reach > 0 ? (platform.engagements / platform.reach) * 100 : 0
        }));
    }

    private static async getDemographicData(userId: string): Promise<any> {
        return {
            age_groups: [
                { age_group: '18-24', percentage: 25 },
                { age_group: '25-34', percentage: 40 },
                { age_group: '35-44', percentage: 20 },
                { age_group: '45-54', percentage: 10 },
                { age_group: '55+', percentage: 5 }
            ],
            genders: [
                { gender: 'male', percentage: 60 },
                { gender: 'female', percentage: 40 }
            ],
            locations: [
                { location: 'Москва', percentage: 35 },
                { location: 'Санкт-Петербург', percentage: 15 },
                { location: 'Новосибирск', percentage: 8 },
                { location: 'Екатеринбург', percentage: 7 },
                { location: 'Другие', percentage: 35 }
            ]
        };
    }

    private static getTopContentFromData(analyticsData: any[], userContent: any[], limit: number): any[] {
        const contentMap = new Map(userContent.map(c => [c._id.toString(), c]));
        const contentAnalytics: Map<string, any> = new Map();

        analyticsData.forEach(analytics => {
            const content = contentMap.get(analytics.content_id.toString());
            if (!content) return;

            const contentIdStr = analytics.content_id.toString();
            if (!contentAnalytics.has(contentIdStr)) {
                contentAnalytics.set(contentIdStr, {
                    content_id: contentIdStr,
                    title: content.title,
                    content_type: content.content_type,
                    platform: content.platform,
                    total_views: 0,
                    total_reach: 0,
                    total_engagements: 0,
                    total_likes: 0,
                    total_comments: 0,
                    total_shares: 0,
                    engagement_rate: 0,
                    click_through_rate: 0,
                    followers_gained: 0
                });
            }

            const current = contentAnalytics.get(contentIdStr)!;
            current.total_views += analytics.views || 0;
            current.total_reach += analytics.reach || 0;
            current.total_engagements += analytics.engagements || 0;
            current.total_likes += analytics.likes || 0;
            current.total_comments += analytics.comments || 0;
            current.total_shares += analytics.shares || 0;
            current.followers_gained += analytics.followers_gained || 0;
        });

        return Array.from(contentAnalytics.values())
            .map(item => ({
                ...item,
                engagement_rate: item.total_reach > 0 ? (item.total_engagements / item.total_reach) * 100 : 0,
                click_through_rate: item.total_views > 0 ? (item.total_engagements / item.total_views) * 100 : 0
            }))
            .sort((a, b) => b.total_engagements - a.total_engagements)
            .slice(0, limit);
    }

    private static calculateComparison(current: any, previous: any): any {
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

    private static getEmptyUserAnalytics(): any {
        return {
            total_views: 0,
            total_reach: 0,
            total_engagements: 0,
            total_likes: 0,
            total_comments: 0,
            total_shares: 0,
            total_followers_gained: 0,
            avg_engagement_rate: 0,
            avg_click_through_rate: 0,
            top_content: [],
            platform_breakdown: [],
            demographic_data: {
                age_groups: [],
                genders: [],
                locations: []
            }
        };
    }
}