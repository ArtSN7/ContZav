import { supabase } from '../services/supabase.service.js';
import { AnalyticsData, ContentAnalytics, UserAnalytics, PlatformAnalytics, DemographicData } from '../types/analytics.js';

export class AnalyticsModel {
    static async getContentAnalytics(contentId: string, startDate: Date, endDate: Date): Promise<AnalyticsData[]> {
        const { data, error } = await supabase
            .from('content_analytics')
            .select('*')
            .eq('content_id', contentId)
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString())
            .order('date', { ascending: true });

        if (error) throw error;
        return data as AnalyticsData[];
    }

    static async getUserAnalytics(userId: string, startDate: Date, endDate: Date, platform?: string): Promise<UserAnalytics> {
        const contentQuery = supabase
            .from('content')
            .select('id, title, content_type, platform')
            .eq('user_id', userId);

        if (platform && platform !== 'all') {
            contentQuery.eq('platform', platform);
        }

        const { data: userContent, error: contentError } = await contentQuery;

        if (contentError) throw contentError;
        if (!userContent || userContent.length === 0) {
            return this.getEmptyUserAnalytics();
        }

        const contentIds = userContent.map(c => c.id);

        const { data: analyticsData, error: analyticsError } = await supabase
            .from('content_analytics')
            .select('*')
            .in('content_id', contentIds)
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        if (analyticsError) throw analyticsError;

        const aggregatedData = this.aggregateAnalyticsData(analyticsData as AnalyticsData[], userContent);
        const platformBreakdown = this.calculatePlatformBreakdown(analyticsData as AnalyticsData[], userContent);
        const demographicData = await this.getDemographicData(userId);

        return {
            ...aggregatedData,
            platform_breakdown: platformBreakdown,
            demographic_data: demographicData
        };
    }

    static async getTopContent(userId: string, startDate: Date, endDate: Date, limit: number = 5): Promise<ContentAnalytics[]> {
        const { data: userContent, error: contentError } = await supabase
            .from('content')
            .select('id, title, content_type, platform')
            .eq('user_id', userId);

        if (contentError) throw contentError;
        if (!userContent || userContent.length === 0) return [];

        const contentIds = userContent.map(c => c.id);

        const { data: analyticsData, error: analyticsError } = await supabase
            .from('content_analytics')
            .select('*')
            .in('content_id', contentIds)
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        if (analyticsError) throw analyticsError;

        const contentMap = new Map(userContent.map(c => [c.id, c]));
        const contentAnalytics: Map<string, ContentAnalytics> = new Map();

        analyticsData?.forEach(analytics => {
            const content = contentMap.get(analytics.content_id);
            if (!content) return;

            if (!contentAnalytics.has(analytics.content_id)) {
                contentAnalytics.set(analytics.content_id, {
                    content_id: analytics.content_id,
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

            const current = contentAnalytics.get(analytics.content_id)!;
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

    private static aggregateAnalyticsData(analyticsData: AnalyticsData[], userContent: any[]): UserAnalytics {
        const aggregated: UserAnalytics = {
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

    private static calculatePlatformBreakdown(analyticsData: AnalyticsData[], userContent: any[]): PlatformAnalytics[] {
        const platformMap = new Map<string, PlatformAnalytics>();
        const contentMap = new Map(userContent.map(c => [c.id, c]));

        analyticsData.forEach(analytics => {
            const content = contentMap.get(analytics.content_id);
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

    private static async getDemographicData(userId: string): Promise<DemographicData> {
        const { data, error } = await supabase
            .from('user_demographics')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
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

        return data as DemographicData;
    }

    private static getTopContentFromData(analyticsData: AnalyticsData[], userContent: any[], limit: number): ContentAnalytics[] {
        const contentMap = new Map(userContent.map(c => [c.id, c]));
        const contentAnalytics: Map<string, ContentAnalytics> = new Map();

        analyticsData.forEach(analytics => {
            const content = contentMap.get(analytics.content_id);
            if (!content) return;

            if (!contentAnalytics.has(analytics.content_id)) {
                contentAnalytics.set(analytics.content_id, {
                    content_id: analytics.content_id,
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

            const current = contentAnalytics.get(analytics.content_id)!;
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

    private static getEmptyUserAnalytics(): UserAnalytics {
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