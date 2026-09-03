const User = require("../models/User.model");

const getMyProfile = async (userId) => {
  const user = await User.findById(userId)
    .select("-passwordHash")
    .populate("departmentId", "name description");

  return user;
};

const updateMyProfile = async (userId, data) => {
  const { name, email } = data;

  const updateData = {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (email !== undefined) {
    updateData.email = email;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  )
    .select("-passwordHash")
    .populate("departmentId", "name description");

  return user;
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
