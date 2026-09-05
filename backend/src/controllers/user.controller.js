const userService = require("../services/user.service");

const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

// GET MY PROFILE
const getMyProfile = async (req, res) => {
  const user = await userService.getMyProfile(req.user._id);

  if (!user) {
    throw apiError(404, "User not found");
  }
  
  return apiResponse(
    res,
    200,
    "Profile fetched successfully",
    user,
  );
};

// UPDATE MY PROFILE
const updateMyProfile = async (req, res) => {
  const user = await userService.updateMyProfile(
    req.user._id,
    req.body,
  );

  if (!user) {
    throw apiError(404, "User not found");
  }

  return apiResponse(
    res,
    200,
    "Profile updated successfully",
    user,
  );
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  const user = await userService.changePassword(
    req.user._id,
    req.body,
  );

  if (!user) {
    throw apiError(404, "User not found");
  }

  return apiResponse(
    res,
    200,
    "Password changed successfully",
    user,
  );
};

// GET ALL USERS - FOR ADMIN
const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();

  return apiResponse(
    res,
    200,
    "Users fetched successfully",
    users
  );
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getAllUsers
};