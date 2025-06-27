const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  usersController.signup
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Enter a valid email"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  usersController.login
);

module.exports = router;
