import { z } from 'zod';

export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    surname: z.string().min(2).max(100).optional(),
    company: z.string().max(200).optional(),
    expertise: z.string().max(500).optional(),
    phone: z.string().max(20).optional(),
    website: z.string().url().max(200).optional(),
    bio: z.string().max(1000).optional()
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6)
});

export const enableTwoFactorSchema = z.object({
    method: z.enum(['sms', 'authenticator'])
});

export const verifyTwoFactorSchema = z.object({
    code: z.string().length(6)
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type EnableTwoFactorDto = z.infer<typeof enableTwoFactorSchema>;
export type VerifyTwoFactorDto = z.infer<typeof verifyTwoFactorSchema>;