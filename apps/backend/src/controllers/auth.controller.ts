import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '../utils/errors';

// Helper function to generate JWT
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'your-temp-secret-key';
  const jwtExpires = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpires });
};

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestError('Email already in use');
      } else {
        throw new BadRequestError('Username already taken');
      }
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // TODO: Send verification email
    
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          xp: user.xp,
          walletAddress: user.walletAddress,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new NotAuthorizedError('Invalid credentials');
    }
    
    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      throw new NotAuthorizedError('Invalid credentials');
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          xp: user.xp,
          walletAddress: user.walletAddress,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Connect wallet to user account
export const connectWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, signature } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new NotAuthorizedError('Authentication required');
    }
    
    // TODO: Verify signature using Solana web3.js
    
    // Update user with wallet address
    const user = await User.findByIdAndUpdate(
      userId,
      { walletAddress },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          xp: user.xp,
          walletAddress: user.walletAddress,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    
    // TODO: Implement email verification logic
    
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal that the user doesn't exist
      return res.status(200).json({
        status: 'success',
        message: 'If a user with that email exists, a password reset link was sent',
      });
    }
    
    // TODO: Generate reset token and send email
    
    res.status(200).json({
      status: 'success',
      message: 'If a user with that email exists, a password reset link was sent',
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // TODO: Implement password reset logic
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new NotAuthorizedError('Authentication required');
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          xp: user.xp,
          walletAddress: user.walletAddress,
          isVerified: user.isVerified,
          learningStreak: user.learningStreak,
          lastActive: user.lastActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = (req: Request, res: Response) => {
  // JWT is stateless, so we just tell the client to remove the token
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
}; 