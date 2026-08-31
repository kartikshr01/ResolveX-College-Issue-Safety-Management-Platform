const authService = require("../services/auth.service");
const apiResponse = require("../utils/apiResponse");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token");

const register = async (req, res) => {
  const user = await authService.register(req.body);

  return apiResponse(
    res,
    201,
    "User registered successfully",
    user,
  );
};

const login = async (req, res) => {
  const user = await authService.login(req.body);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return apiResponse(
    res,
    200,
    "User logged in successfully",
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  );
};

module.exports = {
  register,
  login,
};