import { ActiveSession } from '../models/Profile.js';
import { Types } from 'mongoose';

export class SessionService {
    static async createSession(userId: string, deviceInfo: string, ipAddress: string, location: string): Promise<any> {
        const session = new ActiveSession({
            user_id: new Types.ObjectId(userId),
            device_info: deviceInfo,
            ip_address: ipAddress,
            location: location,
            last_activity: new Date()
        });
        await session.save();
        return session;
    }

    static async updateSessionActivity(sessionId: string): Promise<void> {
        await ActiveSession.findByIdAndUpdate(sessionId, {
            last_activity: new Date()
        });
    }

    static async getCurrentSession(sessionId: string): Promise<any> {
        const session = await ActiveSession.findById(sessionId);
        if (!session) throw new Error('Session not found');
        return session;
    }

    static async getUserSessions(userId: string): Promise<any[]> {
        return ActiveSession.find({ user_id: new Types.ObjectId(userId) })
            .sort({ last_activity: -1 });
    }

    static async cleanupExpiredSessions(): Promise<void> {
        const expirationDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await ActiveSession.deleteMany({
            last_activity: { $lt: expirationDate }
        });
    }
}