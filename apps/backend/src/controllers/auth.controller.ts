import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import User from '../models/user.model';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '../utils/errors';
import { sendEmail } from '../utils/email';

// 扩展Request类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

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
    
    // Send verification email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    // Save verification token to user
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(verificationExpires);
    await user.save({ validateBeforeSave: false });
    
    // Create verification URL
    const verificationURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    
    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Verify Your SoLearn Account',
      text: `Welcome to SoLearn! Please verify your email by clicking: ${verificationURL}`,
      html: `
        <h1>Welcome to SoLearn!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationURL}" target="_blank">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
    
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
    const { walletAddress, signature, message } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new NotAuthorizedError('Authentication required');
    }
    
    // Verify signature using Solana web3.js
    try {
      // Convert base58 signature to Uint8Array
      const signatureUint8 = bs58.decode(signature);
      
      // Get public key from wallet address
      const publicKey = new PublicKey(walletAddress);
      
      // Convert message to Uint8Array
      const messageUint8 = new TextEncoder().encode(message);
      
      // Verify signature
      const isValid = nacl.sign.detached.verify(
        messageUint8,
        signatureUint8,
        publicKey.toBytes()
      );
      
      if (!isValid) {
        throw new BadRequestError('Invalid signature');
      }
    } catch (error) {
      throw new BadRequestError('Failed to verify wallet signature');
    }
    
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
    
    // Implement email verification logic
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new BadRequestError('Invalid or expired verification token');
    }
    
    // Update user verification status
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    // Generate JWT token
    const jwtToken = generateToken(user._id);
    
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      token: jwtToken
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
    
    // Generate reset token and send email
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    
    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(resetExpires);
    await user.save({ validateBeforeSave: false });
    
    // Create reset URL
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    // Send email
    await sendEmail({
      to: user.email,
      subject: 'SoLearn Password Reset',
      text: `You requested a password reset. Please use the following link to reset your password: ${resetURL}. The link will expire in 1 hour.`,
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetURL}" target="_blank">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
    
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
    
    // Implement password reset logic
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }
    
    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    // Generate JWT token
    const jwtToken = generateToken(user._id);
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
      token: jwtToken
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