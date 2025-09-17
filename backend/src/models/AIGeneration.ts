import { supabase } from '../services/supabase.service.js';
import { AIGenerationRequest } from '../types/ai.js';

export class AIGenerationModel {
    static async create(requestData: Partial<AIGenerationRequest>): Promise<AIGenerationRequest> {
        const { data, error } = await supabase
            .from('ai_generation_requests')
            .insert([requestData])
            .select()
            .single();

        if (error) throw error;
        return data as AIGenerationRequest;
    }

    static async findById(requestId: string): Promise<AIGenerationRequest> {
        const { data, error } = await supabase
            .from('ai_generation_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (error) throw error;
        return data as AIGenerationRequest;
    }

    static async updateStatus(requestId: string, status: AIGenerationRequest['status'], result?: any, errorMessage?: string): Promise<AIGenerationRequest> {
        const { data, error } = await supabase
            .from('ai_generation_requests')
            .update({
                status,
                result: result || null,
                error: errorMessage || null,
                updated_at: new Date()
            })
            .eq('id', requestId)
            .select()
            .single();

        if (error) throw error;
        return data as AIGenerationRequest;
    }

    static async findByUserId(userId: string): Promise<AIGenerationRequest[]> {
        const { data, error } = await supabase
            .from('ai_generation_requests')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as AIGenerationRequest[];
    }
}