import { z } from 'zod';

export const analyticsFilterSchema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    platform: z.string().optional(),
    contentType: z.string().optional(),
});

export type AnalyticsFilterDto = z.infer<typeof analyticsFilterSchema>;