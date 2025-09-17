import { z } from 'zod';

export const connectSocialSchema = z.object({
    platform: z.enum(['youtube', 'instagram', 'vk', 'telegram', 'facebook', 'tiktok']),
    accessToken: z.string(),
    refreshToken: z.string().optional(),
    profileData: z.record(z.string(), z.any())
});

export const disconnectSocialSchema = z.object({
    platform: z.enum(['youtube', 'instagram', 'vk', 'telegram', 'facebook', 'tiktok'])
});

export const updateSocialSettingsSchema = z.object({
    platform: z.enum(['youtube', 'instagram', 'vk', 'telegram', 'facebook', 'tiktok']),
    autoPublish: z.boolean().optional(),
    notifications: z.boolean().optional(),
    syncMetrics: z.boolean().optional()
});

export type ConnectSocialDto = z.infer<typeof connectSocialSchema>;
export type DisconnectSocialDto = z.infer<typeof disconnectSocialSchema>;
export type UpdateSocialSettingsDto = z.infer<typeof updateSocialSettingsSchema>;