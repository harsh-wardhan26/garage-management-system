import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate request inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please fill all required fields: name, email, password'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user in database
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Mechanic' // Defaults to Mechanic role
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Fetch user and explicitly include select false password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user profile details
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    // User is already resolved by protect middleware
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with Mechanic role
 * @route   GET /api/auth/mechanics
 * @access  Private
 */
export const getMechanics = async (req, res, next) => {
  try {
    const mechanics = await User.find({ role: 'Mechanic' });
    res.status(200).json({
      success: true,
      data: mechanics
    });
  } catch (error) {
    next(error);
  }
};
