import { z } from 'zod';

export const analyticsFilterSchema = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    platform: z.enum(['youtube', 'instagram', 'vk', 'telegram', 'facebook', 'tiktok', 'all']).optional().default('all'),
    contentType: z.enum(['video', 'text', 'combination', 'all']).optional().default('all'),
    limit: z.number().int().positive().optional()
});

export type AnalyticsFilterDto = z.infer<typeof analyticsFilterSchema>;