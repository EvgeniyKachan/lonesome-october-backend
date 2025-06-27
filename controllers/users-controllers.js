const jwt = require("jsonwebtoken");
const User = require("../models/user");
const createError = require("http-errors");
const { validationResult } = require("express-validator");
const { hashPassword, comparePasswords } = require("../utils/hash");

const JWT_EXPIRES_IN = "1h";
const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      createError(422, "Validation failed", { errors: errors.array() })
    );
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        createError(422, "User exists already, please login instead.")
      );
    }

    let hashed;

    try {
      hashed = await hashPassword(password);
    } catch (err) {
      return next(
        createError(500, "Signing up failed, please try again later.", {
          cause: err,
        })
      );
    }

    const createdUser = new User({
      username,
      email,
      password: hashed,
      character: [],
    });

    await createdUser.save();

    res.status(201).json({
      user: createdUser.toObject({
        getters: true,
        transform: (doc, ret) => {
          delete ret.password;
          return ret;
        },
      }),
    });
  } catch (err) {
    return next(
      createError(500, "Signing up failed, please try again later.", {
        cause: err,
      })
    );
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      createError(422, "Validation failed", { errors: errors.array() })
    );
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, "Incorrect credentials");
    }

    const isMatch = comparePasswords(password, user.password);

    if (!isMatch) {
      throw createError(401, "Incorrect credentials");
    }

    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = signup;
exports.login = login;
