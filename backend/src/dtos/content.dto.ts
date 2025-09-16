import { z } from 'zod';
import { CONTENT_TYPES, PLATFORMS } from '../utils/constants.js';

export const contentCreationSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().min(1),
    niche: z.string().min(1),
    contentType: z.enum(CONTENT_TYPES),
    platforms: z.array(z.enum(PLATFORMS)).min(1),
    tags: z.array(z.string()).optional(),
});

export const contentUpdateSchema = contentCreationSchema.partial();

export type ContentCreationDto = z.infer<typeof contentCreationSchema>;
export type ContentUpdateDto = z.infer<typeof contentUpdateSchema>;