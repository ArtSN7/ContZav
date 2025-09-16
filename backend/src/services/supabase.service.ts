import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

export class SupabaseService {
    static async executeQuery<T>(query: string, params?: any[]): Promise<T[]> {
        const { data, error } = await supabase.rpc('execute_query', { query, params });
        if (error) throw error;
        return data as T[];
    }

    static async handleTransaction(operations: Promise<any>[]): Promise<void> {
        try {
            await Promise.all(operations);
        } catch (error) {
            throw new Error('Transaction failed');
        }
    }
}