import { N8nService } from './n8n.service.js';
import { supabase } from './supabase.service.js';

export class SocialService {
    static async connectAccount(platform: string, credentials: any, userId: string): Promise<void> {
        const { error } = await supabase
            .from('social_accounts')
            .insert({
                user_id: userId,
                platform,
                credentials: JSON.stringify(credentials),
                is_connected: true,
                last_sync: new Date(),
            });

        if (error) throw error;
    }

    static async disconnectAccount(accountId: string): Promise<void> {
        const { error } = await supabase
            .from('social_accounts')
            .update({ is_connected: false })
            .eq('id', accountId);

        if (error) throw error;
    }

    static async schedulePost(content: any, platforms: string[], scheduleDate: Date): Promise<void> {
        const publishData = {
            content,
            platforms,
            scheduleDate: scheduleDate.toISOString(),
        };

        await N8nService.publishContent(publishData, platforms);
    }
}