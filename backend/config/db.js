// backend/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables (if not already loaded, though server.js should do it)
dotenv.config();

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are to prevent Mongoose deprecation warnings.
      // Depending on your Mongoose version, some might not be needed or new ones might be.
      // For Mongoose 6.x and later, these are generally not required as they are default.
      // useNewUrlParser: true, (No longer needed in Mongoose 6+)
      // useUnifiedTopology: true, (No longer needed in Mongoose 6+)
      // useCreateIndex: true, (No longer supported, use createIndexes option on models if needed)
      // useFindAndModify: false (No longer supported)
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log any connection errors
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the process with failure (1) if connection fails
    process.exit(1);
  }
};

export default connectDB;
