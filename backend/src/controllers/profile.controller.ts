import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service.js';
import { UpdateProfileDto, ChangePasswordDto, EnableTwoFactorDto } from '../dtos/profile.dto.js';
import { UserModel } from '../models/User.js';

/**
 * Контроллер для управления профилем пользователя
 * Личные данные, безопасность, активные сессии
 */
export class ProfileController {
    /**
  * Получить полную информацию о профиле пользователя
  * req - Запрос от авторизованного пользователя
  * res - Ответ с данными профиля
  * {UserProfile} - Полные данные профиля пользователя
  */
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

    /**
   * Обновить данные профиля пользователя
   * req - Запрос с новыми данными профиля
   * req.body.name - Новое имя пользователя
   * req.body.email - Новый email (требует подтверждения)
   * req.body.avatar_url - Новая ссылка на аватар
   * res - Ответ с обновленным профилем
   * {UserProfile} - Обновленные данные профиля
   */
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

    /**
   * Изменить пароль пользователя
   * Требует подтверждения текущего пароля
   * req - Запрос с паролями
   * req.body.currentPassword - Текущий пароль для подтверждения
   * req.body.newPassword - Новый пароль
   * res - Ответ с подтверждением смены пароля
   * {Object} - Сообщение об успешной смене пароля
   */
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

    /**
 * Получить настройки двухфакторной аутентификации
 * req - Запрос от авторизованного пользователя
 * res - Ответ с настройками 2FA
 * {TwoFactorSettings} - Текущие настройки двухфакторной аутентификации
 */
    static async getTwoFactorSettings(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const settings = await ProfileService.getTwoFactorSettings(userId);
            res.json(settings);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch 2FA settings' });
        }
    }

    /**
  * Включить двухфакторную аутентификацию
  * req - Запрос с параметрами 2FA
  * req.body.method - Метод 2FA: SMS или приложение-аутентификатор
  * req.body.phoneNumber - Номер телефона (только для SMS метода)
  * res - Ответ с настройками 2FA и резервными кодами
  * {TwoFactorSettings} - Настройки 2FA с резервными кодами
  */
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

    /**
  * Отключить двухфакторную аутентификацию
  * req - Запрос от авторизованного пользователя
  * res - Ответ с обновленными настройками
  * {TwoFactorSettings} - Настройки с отключенной 2FA
  */
    static async disableTwoFactor(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const settings = await ProfileService.disableTwoFactor(userId);
            res.json(settings);
        } catch (error) {
            res.status(500).json({ error: 'Failed to disable 2FA' });
        }
    }

    /**
  * Проверить правильность пароля пользователя
  * Используется для подтверждения действий (удаление аккаунта и т.д.)
  * req - Запрос с паролем для проверки
  * req.body.password - Пароль для проверки
  * res - Ответ с результатом проверки
  * {Object} - Результат проверки пароля
  */
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

    /**
   * Получить список активных сессий пользователя
   * req - Запрос от авторизованного пользователя
   * res - Ответ с массивом активных сессий
   * {ActiveSession[]} - Массив активных сессий с устройствами и локациями
   */
    static async getActiveSessions(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const sessions = await ProfileService.getActiveSessions(userId);
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch active sessions' });
        }
    }

    /**
  * Завершить конкретную сессию пользователя
  * req - Запрос с ID сессии для завершения
  * req.params.sessionId - ID сессии для завершения
  * res - Ответ с подтверждением завершения
  * {Object} - Сообщение об успешном завершении сессии
  */
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

    /**
   * Завершить все сессии пользователя кроме текущей
   * Используется при смене пароля или подозрительной активности
   * req - Запрос от авторизованного пользователя
   * res - Ответ с подтверждением завершения сессий
   * {Object} - Сообщение об успешном завершении всех сессий
   */
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