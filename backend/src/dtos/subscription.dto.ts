import { z } from 'zod';

export const createSubscriptionSchema = z.object({
    name: z.string().min(1).max(100),
    price: z.number().positive(),
    currency: z.string().length(3),
    monthly_limit: z.number().int().positive(),
    social_networks_limit: z.number().int().positive(),
    features: z.array(z.string()),
    is_active: z.boolean().default(true)
});

export const updateSubscriptionSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    price: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    monthly_limit: z.number().int().positive().optional(),
    social_networks_limit: z.number().int().positive().optional(),
    features: z.array(z.string()).optional(),
    is_active: z.boolean().optional()
});

export type CreateSubscriptionDto = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionDto = z.infer<typeof updateSubscriptionSchema>;