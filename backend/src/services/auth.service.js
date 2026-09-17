const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const apiError = require("../utils/apiError");

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw apiError(409, "User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    passwordHash,
    role: "STUDENT",
    active: true,
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    active: newUser.active,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw apiError(401, "Invalid email or password");
  }

  if (!user.active) {
    throw apiError(403, "Your account is inactive");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!passwordMatch) {
    throw apiError(401, "Invalid email or password");
  }

  return user;
};

module.exports = {
  register,
  login,
};