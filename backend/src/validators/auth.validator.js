const Joi = require("joi")

const registrationValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim(),

  email: Joi.string()
    .email()
    .min(8)
    .max(100)
    .required()
    .trim()
    .lowercase(),

  password: Joi.string()
    .min(8)
    .required(),
});

const loginValidator = Joi.object({
  email: Joi.string()
    .email()
    .min(8)
    .max(100)
    .required()
    .trim()
    .lowercase(),

  password: Joi.string()
    .min(8)
    .required(),
});

module.exports = {
  registrationValidator,
  loginValidator,
};