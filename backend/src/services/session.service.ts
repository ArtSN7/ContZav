import { supabase } from '../services/supabase.service.js';
import { ActiveSession } from '../types/profile.js';

export class SessionService {
    static async createSession(userId: string, deviceInfo: string, ipAddress: string, location: string): Promise<ActiveSession> {
        const { data, error } = await supabase
            .from('active_sessions')
            .insert([{
                user_id: userId,
                device_info: deviceInfo,
                ip_address: ipAddress,
                location: location,
                last_activity: new Date()
            }])
            .select()
            .single();

        if (error) throw error;
        return data as ActiveSession;
    }

    static async updateSessionActivity(sessionId: string): Promise<void> {
        const { error } = await supabase
            .from('active_sessions')
            .update({ last_activity: new Date() })
            .eq('id', sessionId);

        if (error) throw error;
    }

    static async getCurrentSession(sessionId: string): Promise<ActiveSession> {
        const { data, error } = await supabase
            .from('active_sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (error) throw error;
        return data as ActiveSession;
    }
}