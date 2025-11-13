import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';

export class WebSocketService {
    private static io: Server;

    static initialize(ioInstance: Server) {
        this.io = ioInstance;

        this.io.on('connection', (socket) => {
            logger.info(`Client connected: ${socket.id}`);

            socket.on('join-user-room', (userId: string) => {
                socket.join(`user-${userId}`);
                logger.info(`Client ${socket.id} joined user room: user-${userId}`);
            });

            socket.on('disconnect', () => {
                logger.info(`Client disconnected: ${socket.id}`);
            });
        });

        return this.io;
    }

    static getIO() {
        if (!this.io) {
            throw new Error('WebSocket service not initialized');
        }
        return this.io;
    }

    static emitToUser(userId: string, event: string, data: any) {
        if (this.io) {
            this.io.to(`user-${userId}`).emit(event, data);
        }
    }

    static emitGenerationProgress(userId: string, contentId: string, progress: number, message: string) {
        this.emitToUser(userId, 'generation-progress', { contentId, progress, message });
    }

    static emitVideoReady(userId: string, contentId: string, videoUrl: string) {
        this.emitToUser(userId, 'video-ready', { contentId, videoUrl });
    }

    static emitContentReady(userId: string, contentId: string, content: any) {
        this.emitToUser(userId, 'content-ready', { contentId, content });
    }

    static emitQuestionsReady(userId: string, requestId: string, questions: string[]) {
        this.emitToUser(userId, 'questions-ready', { requestId, questions });
    }

    static emitGenerationError(userId: string, requestId: string, error: string) {
        this.emitToUser(userId, 'generation-error', { requestId, error });
    }
}