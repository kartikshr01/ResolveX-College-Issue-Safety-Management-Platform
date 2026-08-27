const User = require("../models/user.model");
const bcrypt = require("bcrypt");

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

const changePassword = async(userId, data) => {
  const {oldPassword, newPassword} = data;

  const user = await User.findById(userId);

  const passwordCheck = await bcrypt.compare(oldPassword, user.passwordHash);

  if(!passwordCheck){
    throw new Error("Old password does not match");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}


module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword
};