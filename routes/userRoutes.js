const express = require("express");
const route = express.Router();

// controllers
const {
  signInHandler,
  signUpHanlder,
} = require("../controllers/authController");

route.post("/signup", signUpHanlder);
route.get("/signin", signInHandler);

module.exports = route;
