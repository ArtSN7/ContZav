import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000'),
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string(),
    SUPABASE_SERVICE_KEY: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    VK_CLIENT_ID: z.string(),
    VK_CLIENT_SECRET: z.string(),
    VK_SERVICE_TOKEN: z.string(),
    APPLE_CLIENT_ID: z.string(),
    APPLE_TEAM_ID: z.string(),
    APPLE_KEY_ID: z.string(),
    APPLE_PRIVATE_KEY: z.string(),
    JWT_SECRET: z.string(),
    FRONTEND_URL: z.string().url().default('http://localhost:3000')
});

export const config = envSchema.parse(process.env);