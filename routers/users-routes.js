import express from "express";
import { body } from "express-validator";
import usersController from "../controllers/users-controllers.js";

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

export default router;
