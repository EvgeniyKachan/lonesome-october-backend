import createError from "http-errors";
import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(createError(401, "No token provided"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (err) {
    next(createError(401, "Invalid or expired token"));
  }
};

export default authenticateJWT;
