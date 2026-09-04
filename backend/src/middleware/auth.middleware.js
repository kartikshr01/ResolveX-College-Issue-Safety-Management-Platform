const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = 
    req.header("Authorization")?.replace("Bearer ", "") || 
    req.cookies?.accessToken;

  if (!token) {
    throw apiError(401, "Authentication required");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw apiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded.userId || decoded._id).select("-passwordHash");

  
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
