import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_KEY: z.string(),
    SUPABASE_ANON_KEY: z.string(),
    N8N_URL: z.string().url(),
    N8N_API_KEY: z.string(),
    JWT_SECRET: z.string(),
    REDIS_URL: z.string().optional(),
});

export const config = envSchema.parse(process.env);