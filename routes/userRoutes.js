const express = require('express');

const route = express.Router();
const { body } = require('express-validator');
const { User } = require('../models');

// controllers
const {
  signInHandler,
  signUpHanlder,
} = require('../controllers/authController');

route.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (value) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
          throw new Error('E-Mail address already exists!');
        }
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6, max: 30 })
      .withMessage('Password must be at least 6 characters long'),
    body('username')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Name must be at least 4 characters long'),
  ],
  signUpHanlder,
);
route.post('/signin', signInHandler);

module.exports = route;
