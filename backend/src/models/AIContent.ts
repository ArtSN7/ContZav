import { supabase } from '../services/supabase.service.js';
import { AIContent } from '../types/ai';

export class AIContentModel {
    static async create(contentData: Partial<AIContent>): Promise<AIContent> {
        const { data, error } = await supabase
            .from('ai_content')
            .insert([contentData])
            .select()
            .single();

        if (error) throw error;
        return data as AIContent;
    }

    static async findById(contentId: string): Promise<AIContent> {
        const { data, error } = await supabase
            .from('ai_content')
            .select('*')
            .eq('id', contentId)
            .single();

        if (error) throw error;
        return data as AIContent;
    }

    static async findByUserId(userId: string): Promise<AIContent[]> {
        const { data, error } = await supabase
            .from('ai_content')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as AIContent[];
    }

    static async update(contentId: string, contentData: Partial<AIContent>): Promise<AIContent> {
        const { data, error } = await supabase
            .from('ai_content')
            .update(contentData)
            .eq('id', contentId)
            .select()
            .single();

        if (error) throw error;
        return data as AIContent;
    }

    static async updateStatus(contentId: string, status: AIContent['status']): Promise<AIContent> {
        return this.update(contentId, { status });
    }

    static async addFeedback(contentId: string, feedback: string): Promise<AIContent> {
        return this.update(contentId, { feedback });
    }

    static async scheduleContent(contentId: string, platforms: string[], scheduleDate: Date): Promise<AIContent> {
        return this.update(contentId, {
            platforms,
            schedule_date: scheduleDate,
            status: 'scheduled'
        });
    }

    static async markAsPublished(contentId: string, publishDate: Date): Promise<AIContent> {
        return this.update(contentId, {
            publish_date: publishDate,
            status: 'published'
        });
    }
}