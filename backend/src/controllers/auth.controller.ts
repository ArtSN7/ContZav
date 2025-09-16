import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.service.js';
import { UserModel } from '../models/User.js';
import { AppError } from '../exceptions/AppError.js';
import { loginSchema, registerSchema } from '../dtos/auth.dto.js';

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = registerSchema.parse(req.body);

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: validatedData.email,
                password: validatedData.password,
            });

            if (authError) throw new AppError(authError.message, 400);

            const user = await UserModel.updateProfile(authData.user!.id, {
                name: validatedData.name,
                email: validatedData.email,
            });

            res.status(201).json({
                success: true,
                data: { user, session: authData.session },
                message: 'User registered successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = loginSchema.parse(req.body);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: validatedData.email,
                password: validatedData.password,
            });

            if (error) throw new AppError('Invalid credentials', 401);

            res.json({
                success: true,
                data: { user: data.user, session: data.session },
                message: 'Login successful',
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw new AppError('Logout failed', 500);

            res.json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new AppError('Unauthorized', 401);

            const user = await UserModel.findById(req.user.id);
            const socialAccounts = await UserModel.getSocialAccounts(req.user.id);

            res.json({
                success: true,
                data: { user, socialAccounts },
            });
        } catch (error) {
            next(error);
        }
    }
}