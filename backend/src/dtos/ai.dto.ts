import { z } from 'zod';

export const generateNicheSchema = z.object({
    niche: z.string().min(10).max(1000),
    contentType: z.enum(['video', 'text', 'combination'])
});

export const generateQuestionsSchema = z.object({
    niche: z.string().min(10).max(1000),
    contentType: z.enum(['video', 'text', 'combination']),
    selectedQuestions: z.array(z.string()).optional()
});

export const generateContentSchema = z.object({
    niche: z.string().min(10).max(1000),
    contentType: z.enum(['video', 'text', 'combination']),
    questions: z.array(z.string()),
    style: z.string().optional(),
    tone: z.string().optional(),
    length: z.number().optional()
});

export const approveContentSchema = z.object({
    contentId: z.string().uuid(),
    approved: z.boolean(),
    feedback: z.string().optional()
});

export const scheduleContentSchema = z.object({
    contentId: z.string().uuid(),
    platforms: z.array(z.enum(['youtube', 'instagram', 'vk', 'telegram', 'facebook', 'tiktok', 'twitter', 'pinterest', 'linkedin', 'yandex_zen'])),
    scheduleType: z.enum(['auto', 'manual']),
    publishDate: z.string().datetime().optional(),
    publishTime: z.string().optional()
});

export type GenerateNicheDto = z.infer<typeof generateNicheSchema>;
export type GenerateQuestionsDto = z.infer<typeof generateQuestionsSchema>;
export type GenerateContentDto = z.infer<typeof generateContentSchema>;
export type ApproveContentDto = z.infer<typeof approveContentSchema>;
export type ScheduleContentDto = z.infer<typeof scheduleContentSchema>;