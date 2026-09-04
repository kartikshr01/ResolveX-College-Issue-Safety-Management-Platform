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

const getAllUsers = async () => {
  const users = await User.find()
    .select("-passwordHash")
    .populate("departmentId", "name description")
    .sort({ createdAt: -1 });

  return users;
};

const changePassword = async (userId, passwordData) => {
  const { currentPassword, newPassword } = passwordData;

  const user = await User.findById(userId);

  if (!user) {
    throw apiError(404, "User not found");
  }

  const isPasswordCorrect = await user.comparePassword(
    currentPassword
  );

  if (!isPasswordCorrect) {
    throw apiError(400, "Current password is incorrect");
  }

  user.passwordHash = bcrypt.hash(newPassword,10);

  await user.save();

  return user;
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  changePassword
};
