import { supabase } from '../services/supabase.service.js';
import { ContentData } from '../types/index.js';

export class ContentModel {
    static async create(contentData: Omit<ContentData, 'id' | 'created_at'>): Promise<ContentData> {
        const { data, error } = await supabase
            .from('content')
            .insert(contentData)
            .select()
            .single();

        if (error) throw error;
        return data as ContentData;
    }

    static async findByUserId(userId: string): Promise<ContentData[]> {
        const { data, error } = await supabase
            .from('content')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ContentData[];
    }

    static async updateStatus(contentId: string, status: ContentData['status']): Promise<ContentData> {
        const { data, error } = await supabase
            .from('content')
            .update({ status })
            .eq('id', contentId)
            .select()
            .single();

        if (error) throw error;
        return data as ContentData;
    }
}