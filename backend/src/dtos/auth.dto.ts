import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
    company: z.string().optional(),
    expertise: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const oauthCallbackSchema = z.object({
    code: z.string(),
    state: z.string().optional(),
});

export const refreshTokenSchema = z.object({
    refresh_token: z.string(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type OAuthCallbackDto = z.infer<typeof oauthCallbackSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;