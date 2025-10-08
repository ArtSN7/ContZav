import mongoose from 'mongoose';
import { config } from '../config/index.js';

export class DatabaseService {
    static async connect(): Promise<void> {
        try {
            await mongoose.connect(config.MONGODB_URI, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }

    static async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }

    static async healthCheck(): Promise<boolean> {
        try {
            await mongoose.connection.db.admin().ping();
            return true;
        } catch (error) {
            return false;
        }
    }
}