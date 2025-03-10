import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BadRequestError } from '../utils/errors';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
    }));
    
    throw new BadRequestError('Validation error', validationErrors);
  }
  
  next();
}; 