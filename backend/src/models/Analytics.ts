import { supabase } from '../services/supabase.service.js';
import { AnalyticsData } from '../types/index.js';

export class AnalyticsModel {
    static async getContentAnalytics(contentId: string, startDate: Date, endDate: Date): Promise<AnalyticsData[]> {
        const { data, error } = await supabase
            .from('content_analytics')
            .select('*')
            .eq('content_id', contentId)
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        if (error) throw error;
        return data as AnalyticsData[];
    }

    static async getUserAnalytics(userId: string, period: { start: Date; end: Date }): Promise<any> {
        const { data, error } = await supabase
            .from('content_analytics')
            .select(`
        *,
        content:content_id (title, content_type)
      `)
            .in('content.user_id', [userId])
            .gte('date', period.start.toISOString())
            .lte('date', period.end.toISOString());

        if (error) throw error;
        return data;
    }
}