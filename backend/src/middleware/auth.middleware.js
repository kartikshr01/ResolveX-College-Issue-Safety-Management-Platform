const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw apiError(401, "Authentication required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw apiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded.userId).select(
    "-passwordHash"
  );

  if (!user) {
    throw apiError(401, "User not found");
  }

  if (!user.active) {
    throw apiError(403, "Your account is inactive");
  }

  req.user = user;

  next();
});

module.exports = authMiddleware;