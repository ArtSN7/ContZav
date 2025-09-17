import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service.js';
import { UpdateProfileDto, ChangePasswordDto, EnableTwoFactorDto } from '../dtos/profile.dto.js';
import { UserModel } from '../models/User.js';

export class ProfileController {
    static async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const user = await UserModel.findById(userId);
            const socialAccounts = await UserModel.getSocialAccounts(userId);

            res.json({
                success: true,
                data: { user, socialAccounts },
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const profileData: UpdateProfileDto = req.body;

            const updatedUser = await UserModel.updateProfile(userId, profileData);

            res.json({
                success: true,
                data: updatedUser,
                message: 'Profile updated successfully',
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    static async changePassword(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { currentPassword, newPassword }: ChangePasswordDto = req.body;
            await ProfileService.changePassword(userId, currentPassword, newPassword);
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to change password' });
        }
    }

    static async getTwoFactorSettings(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const settings = await ProfileService.getTwoFactorSettings(userId);
            res.json(settings);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch 2FA settings' });
        }
    }

    static async enableTwoFactor(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { method }: EnableTwoFactorDto = req.body;
            const settings = await ProfileService.enableTwoFactor(userId, method);
            res.json(settings);
        } catch (error) {
            res.status(500).json({ error: 'Failed to enable 2FA' });
        }
    }

    static async disableTwoFactor(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const settings = await ProfileService.disableTwoFactor(userId);
            res.json(settings);
        } catch (error) {
            res.status(500).json({ error: 'Failed to disable 2FA' });
        }
    }

    static async verifyPassword(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { password } = req.body;
            const isValid = await ProfileService.verifyPassword(userId, password);
            res.json({ valid: isValid });
        } catch (error) {
            res.status(500).json({ error: 'Failed to verify password' });
        }
    }

    static async getActiveSessions(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const sessions = await ProfileService.getActiveSessions(userId);
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch active sessions' });
        }
    }

    static async terminateSession(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { sessionId } = req.params;
            await ProfileService.terminateSession(userId, sessionId);
            res.json({ message: 'Session terminated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to terminate session' });
        }
    }

    static async terminateAllSessions(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            await ProfileService.terminateAllSessions(userId);
            res.json({ message: 'All sessions terminated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to terminate sessions' });
        }
    }
}