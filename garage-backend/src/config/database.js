import mongoose from 'mongoose';

/**
 * Establish connection to the MongoDB Database.
 * Uses MONGO_URI from the environment variables.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/garage_management';
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // Terminate process on database connection failure
    process.exit(1);
  }
};

export default connectDB;
