const jwt = require("jsonwebtoken");

const authService = require("../services/auth.service");
const User = require("../models/User.model");

const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const register = async (req, res) => {
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/RegisterBody"
          }
        }
      }
    }
  */
  const user = await authService.register(req.body);

  return apiResponse(res, 201, "User registered successfully", user);
};

const login = async (req, res) => {
/*
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/LoginBody"
          }
        }
      }
    }
  */

  const user = await authService.login(req.body);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return apiResponse(res, 200, "User logged in successfully", {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    departmentId: user.departmentId,
  });
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw apiError(401, "Refresh token required");
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw apiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw apiError(401, "User not found");
  }

  if (!user.active) {
    throw apiError(403, "Your account is inactive");
  }

  const accessToken = generateAccessToken(user);

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  return apiResponse(res, 200, "Access token refreshed");
};

const logout = async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return apiResponse(res, 200, "User logged out successfully");
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
