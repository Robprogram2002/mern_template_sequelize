const bcrypt = require("bcryptjs");
const { User } = require("../models/");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

module.exports = {
  signUpHanlder: async (req, res, next) => {
    const { email, username, password } = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const hashedPw = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        email: email,
        password: hashedPw,
        name: username,
      });

      return res.json({
        message: "User created succesfully",
        user: newUser.toJSON(),
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },

  signInHandler: async (req, res, next) => {
    const { email, password } = req.body;

    let loadUser;
    try {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }

      loadedUser = user;
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION }
      );
      return res.status(200).json({ token: token, userId: loadedUser.uuid });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },
};
