import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate-request';

const router = express.Router();

// Register new user
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  validateRequest,
  authController.register
);

// Login user
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validateRequest,
  authController.login
);

// Connect wallet to user account
router.post(
  '/connect-wallet',
  [
    body('walletAddress')
      .isString()
      .withMessage('Wallet address is required'),
    body('signature')
      .isString()
      .withMessage('Signature is required'),
  ],
  validateRequest,
  authController.connectWallet
);

// Verify user email
router.get('/verify/:token', authController.verifyEmail);

// Request password reset
router.post(
  '/forgot-password',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
  ],
  validateRequest,
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password/:token',
  [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  validateRequest,
  authController.resetPassword
);

// Get current user
router.get('/me', authController.getCurrentUser);

// Logout user
router.post('/logout', authController.logout);

export default router; 