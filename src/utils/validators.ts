import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import mongoose from 'mongoose'

import User from '../models/userModel'
import { UserRole } from './constant'

// Validate MongoDB ObjectId
export const isValidObjectId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid user ID format' })
    return false
  }
  return true
}

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    for (const validation of validations) {
      const result = await validation.run(req)
      if (!result.isEmpty()) break
    }

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(422).json({ errors: errors.array() })
  }
}

// Login validator
export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
]

// Signup validator
export const signupValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email })
      if (user) {
        throw new Error('Email already in use')
      }
      return true
    }),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
]

// Validator for creating an event
export const createEventValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .toDate()
    .withMessage('Date must be a valid ISO8601 string'),
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('User ID must be a valid Mongo ID'),
]

// Validator for updating an event
export const updateEventValidator = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Date must be a valid ISO8601 string'),
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),
]
