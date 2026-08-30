import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_12345', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, ward, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'CITIZEN',
      department: department || null,
      ward: ward || null,
      phone: phone || null,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token: generateToken(user._id),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoURL: user.photoURL,
            isActive: user.isActive,
          },
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Your account has been deactivated.',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: {
          token: generateToken(user._id),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoURL: user.photoURL,
            isActive: user.isActive,
          },
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User profile fetched',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || null,
        photoURL: req.user.photoURL,
        role: req.user.role,
        department: req.user.department || null,
        ward: req.user.ward || null,
        isActive: req.user.isActive,
        createdAt: req.user.createdAt,
      },
    },
  });
};
