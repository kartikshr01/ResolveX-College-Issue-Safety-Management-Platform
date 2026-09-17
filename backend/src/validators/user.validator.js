const joi = require("joi");

const updateProfileValidator = joi.object({
  name: joi.string().min(2).max(50).trim(),

  email: joi.string().min(8).max(100).trim().lowercase(),
});

module.exports = {
  updateProfileValidator,
};