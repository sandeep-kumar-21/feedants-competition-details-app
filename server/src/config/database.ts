import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (uri?: string): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  const connectionUri = uri || env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(connectionUri, {
      autoIndex: true,
    });
    console.log(`MongoDB connected successfully to database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected gracefully');
  } catch (error) {
    console.error('Error during MongoDB disconnection:', error);
  }
};
