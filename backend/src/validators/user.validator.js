const joi = require("joi");

const updateProfileValidator = joi.object({
  name: joi.string().min(2).max(50).trim(),

  email: joi.string().min(8).max(100).trim().lowercase(),
});

const changePasswordValidator = joi.object({
  currentPassword: joi.string().min(8).required(),

  newPassword: joi.string().min(8).required(),
});

module.exports = {
  updateProfileValidator,
  changePasswordValidator,
};
