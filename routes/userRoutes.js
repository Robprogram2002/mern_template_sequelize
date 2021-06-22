const express = require("express");
const route = express.Router();
const { body } = require("express-validator");
const { User } = require("../models/");

// controllers
const {
  signInHandler,
  signUpHanlder,
} = require("../controllers/authController");

route.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6, max: 30 })
      .withMessage("Password must be at least 6 characters long"),
    body("username")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Name must be at least 4 characters long"),
  ],
  signUpHanlder
);
route.get("/signin", signInHandler);

module.exports = route;
