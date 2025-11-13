import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export class WebSocketService {
    private static io: SocketIOServer;

    static initialize(io: SocketIOServer) {
        this.io = io;

        io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            try {
                const decoded = jwt.verify(token, config.JWT_SECRET);
                socket.data.user = decoded;
                next();
            } catch (error) {
                next(new Error('Authentication error'));
            }
        });

        io.on('connection', (socket) => {
            console.log('User connected:', socket.data.user.sub);

            socket.join(`user:${socket.data.user.sub}`);

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.data.user.sub);
            });
        });
    }

    static emitToUser(userId: string, event: string, data: any) {
        if (this.io) {
            this.io.to(`user:${userId}`).emit(event, data);
        }
    }

    static emitGenerationProgress(userId: string, contentId: string, progress: number) {
        this.emitToUser(userId, 'generation-progress', {
            contentId,
            progress,
            message: `Generation progress: ${progress}%`
        });
    }

    static emitVideoReady(userId: string, contentId: string, videoUrl: string) {
        this.emitToUser(userId, 'video-ready', {
            contentId,
            videoUrl
        });
    }

    static emitContentReady(userId: string) {
        this.emitToUser(userId, 'content-ready', {});
    }
}