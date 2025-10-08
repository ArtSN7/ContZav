import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service.js';
import { User } from '../models/User.js';
import { SocialAccount } from '../models/User.js';

export class ProfileController {
    /**
     * Получить полную информацию о профиле пользователя
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с данными профиля
     * @returns {Object} Полные данные профиля пользователя
     */
    static async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const user = await User.findById(userId);
            const profile = await ProfileService.getProfile(userId);
            const socialAccounts = await SocialAccount.find({ user_id: userId });

            res.json({
                success: true,
                data: { user, profile, socialAccounts },
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }

    /**
     * Обновить данные профиля пользователя
     * @param req - Запрос с новыми данными профиля
     * @param req.body.name - Новое имя пользователя
     * @param req.body.email - Новый email (требует подтверждения)
     * @param req.body.avatar_url - Новая ссылка на аватар
     * @param res - Ответ с обновленным профилем
     * @returns {Object} Обновленные данные профиля
     */
    static async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const profileData = req.body;

            const updatedProfile = await ProfileService.updateProfile(userId, profileData);

            res.json({
                success: true,
                data: updatedProfile,
                message: 'Profile updated successfully',
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    /**
     * Изменить пароль пользователя
     * Требует подтверждения текущего пароля
     * @param req - Запрос с паролями
     * @param req.body.currentPassword - Текущий пароль для подтверждения
     * @param req.body.newPassword - Новый пароль
     * @param res - Ответ с подтверждением смены пароля
     * @returns {Object} Сообщение об успешной смене пароля
     */
    static async changePassword(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { currentPassword, newPassword } = req.body;
            await ProfileService.changePassword(userId, currentPassword, newPassword);
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to change password' });
        }
    }

    /**
     * Получить настройки двухфакторной аутентификации
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с настройками 2FA
     * @returns {Object} Текущие настройки двухфакторной аутентификации
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
     * @param req - Запрос с параметрами 2FA
     * @param req.body.method - Метод 2FA: SMS или приложение-аутентификатор
     * @param req.body.phoneNumber - Номер телефона (только для SMS метода)
     * @param res - Ответ с настройками 2FA и резервными кодами
     * @returns {Object} Настройки 2FA с резервными кодами
     */
    static async enableTwoFactor(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { method, phoneNumber } = req.body;
            const settings = await ProfileService.enableTwoFactor(userId, method, phoneNumber);
            res.json(settings);
        } catch (error) {
            res.status(500).json({ error: 'Failed to enable 2FA' });
        }
    }

    /**
     * Отключить двухфакторную аутентификацию
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с обновленными настройками
     * @returns {Object} Настройки с отключенной 2FA
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
     * @param req - Запрос с паролем для проверки
     * @param req.body.password - Пароль для проверки
     * @param res - Ответ с результатом проверки
     * @returns {Object} Результат проверки пароля
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
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с массивом активных сессий
     * @returns {Object[]} Массив активных сессий с устройствами и локациями
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
 * @param req - Запрос с ID сессии для завершения
 * @param req.params.sessionId - ID сессии для завершения
 * @param res - Ответ с подтверждением завершения
 * @returns {Object} Сообщение об успешном завершении сессии
 */
    static async terminateSession(req: Request, res: Response) {
        try {
            const { sessionId } = req.params;
            await ProfileService.terminateSession(sessionId);
            res.json({ message: 'Session terminated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to terminate session' });
        }
    }

    /**
     * Завершить все сессии пользователя кроме текущей
     * Используется при смене пароля или подозрительной активности
     * @param req - Запрос от авторизованного пользователя
     * @param res - Ответ с подтверждением завершения сессий
     * @returns {Object} Сообщение об успешном завершении всех сессий
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

    /**
     * Создать новую сессию пользователя
     * @param req - Запрос с информацией об устройстве
     * @param req.body.deviceInfo - Информация об устройстве
     * @param req.body.ipAddress - IP адрес
     * @param req.body.location - Локация
     * @param res - Ответ с созданной сессией
     * @returns {Object} Созданная сессия
     */
    static async createSession(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { deviceInfo, ipAddress, location } = req.body;
            const session = await ProfileService.createSession(userId, deviceInfo, ipAddress, location);
            res.json(session);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create session' });
        }
    }
}