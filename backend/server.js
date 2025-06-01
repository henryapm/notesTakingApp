// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
// Import API routes
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

app.use(cors(corsOptions)); // <--- UPDATE THIS LINE
// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// --- Middleware ---
// CORS Configuration
const corsOptions = {
  // We'll set the CORS_ORIGIN in our Render environment variables
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions)); 

// Body parsing middleware
// Allows us to accept JSON data in the request body (e.g., for creating notes)
app.use(express.json());
// Allows us to accept URL-encoded data (less common for APIs, but good to have)
app.use(express.urlencoded({ extended: false }));

// --- Database Connection ---
// Call the function to connect to MongoDB
connectDB();

// --- API Routes ---
// A simple test route to make sure the server is responding
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


// --- Server Listening ---
// Get the port from environment variables or use 5001 as a default
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log('Server started at http://localhost:' + PORT);
});
