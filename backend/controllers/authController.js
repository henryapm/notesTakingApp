// backend/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// --- Helper Function to Generate JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// --- Controller Functions ---

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed by the pre-save hook in User model)
    const user = await User.create({
      username,
      password,
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      // Send response (excluding password)
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: token,
        message: 'User registered successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      // User found and password matches
      const token = generateToken(user._id);

      res.json({
        _id: user._id,
        username: user.username,
        token: token,
        message: 'User logged in successfully'
      });
    } else {
      // User not found or password does not match
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Get current logged in user profile (Example, can be expanded)
 * @route   GET /api/auth/me
 * @access  Private (requires token)
 */
export const getMe = async (req, res) => {
    // The user object is attached to req.user by the authMiddleware
    // We will create authMiddleware later
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      createdAt: req.user.createdAt
    });
  } else {
    res.status(404).json({ message: 'User not found' });
    // This case should ideally not be reached if authMiddleware is working correctly
  }
};
