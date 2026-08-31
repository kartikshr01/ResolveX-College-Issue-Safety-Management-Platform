const userService = require("../services/user.service");

const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

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

module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword
};