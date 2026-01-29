import { body } from "express-validator";

export const credentials = [
  body("email")
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email'),
  body("password")
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password length too short'),
]

export const signUp = [
  credentials,
  body("confirm")
    .trim()
    .notEmpty().withMessage('Confirm password')
    .custom((value, { req }) => {
      if(value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true;
    })
]
