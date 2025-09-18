import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export class TokenService {
    static generateAccessToken(userId: string, email: string): string {
        return jwt.sign(
            { sub: userId, email },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    static generateRefreshToken(userId: string): string {
        return jwt.sign(
            { sub: userId },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    static verifyToken(token: string): any {
        return jwt.verify(token, config.JWT_SECRET);
    }

    static decodeToken(token: string): any {
        return jwt.decode(token);
    }
}