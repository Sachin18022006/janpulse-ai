import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to MongoDB via MONGODB_URI...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('MongoDB Connected to Atlas/External Database successfully.');
      return;
    }

    // Zero-config fallback: MongoMemoryServer for instant out-of-the-box local testing with full 2dsphere support!
    console.log('No MONGODB_URI provided. Initializing in-memory MongoDB server for instant demonstration...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'janpulse',
      }
    });
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB at: ${uri}`);
  } catch (error) {
    console.error('Error connecting to primary MongoDB:', error.message);
    try {
      console.log('Falling back to MongoMemoryServer...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`Fallback connected to in-memory MongoDB at: ${uri}`);
    } catch (fallbackErr) {
      console.error('MongoDB connection completely failed:', fallbackErr.message);
      process.exit(1);
    }
  }
};
