import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

const supabaseUrl = config.SUPABASE_URL;
const supabaseAnonKey = config.SUPABASE_ANON_KEY;
const supabaseServiceKey = config.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error('Supabase URL and keys are required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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