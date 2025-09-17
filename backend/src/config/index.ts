import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default(5001),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),

    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string(),
    SUPABASE_SERVICE_KEY: z.string().optional().default(''),

    JWT_SECRET: z.string().default('secret'),

    GOOGLE_CLIENT_ID: z.string().optional().default(''),
    GOOGLE_CLIENT_SECRET: z.string().optional().default(''),

    VK_CLIENT_ID: z.string().optional().default(''),
    VK_CLIENT_SECRET: z.string().optional().default(''),

    APPLE_CLIENT_ID: z.string().optional().default(''),
    APPLE_TEAM_ID: z.string().optional().default(''),
    APPLE_KEY_ID: z.string().optional().default(''),
    APPLE_PRIVATE_KEY: z.string().optional().default(''),

    N8N_URL: z.string().url().optional().default('http://localhost:5678'),
    N8N_API_KEY: z.string().optional().default(''),

    AI_SERVICE_URL: z.string().url().optional().default('http://localhost:8000'),
    AI_API_KEY: z.string().optional().default(''),

    VIDEO_GENERATION_URL: z.string().url().optional().default('http://localhost:8001'),

    LOG_LEVEL: z.string().optional().default('info')
});

export const config = envSchema.parse(process.env);