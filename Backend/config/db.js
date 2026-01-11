import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongoServer = null;

export const dbConnect = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL || process.env.MONGODB_URI;

    // Try to connect to real MongoDB if URI is provided and not default
    if (mongoURI && mongoURI !== 'mongodb://localhost:27017/intervyo') {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s
      });
      console.log('✅ MongoDB connected successfully');
      return;
    } else {
      throw new Error('No valid MongoDB URI, using in-memory database');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'test') {
      // In test mode, we might want to fail fast or use a specific test DB, 
      // but for now, falling back to in-memory is acceptable or we can just log.
      console.log('⚠️  MongoDB not available in test, proceeding (might rely on mocks or in-memory).', error.message);
    } else {
      console.log('⚠️  MongoDB not available:', error.message);
      console.log('🔄 Starting in-memory database...');
    }

    try {
      // Start in-memory MongoDB server
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'intervyo'
        }
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ In-memory MongoDB started successfully');
      console.log('📝 Note: Data will be lost when server restarts');
      console.log('💡 Tip: Add a real MongoDB URI to .env to persist data');
    } catch (memError) {
      console.error('❌ Failed to start in-memory database:', memError);
      // In test environment, we might catch this at the runner level
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      }
      throw memError;
    }
  }
};

// Cleanup function
export const dbDisconnect = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
