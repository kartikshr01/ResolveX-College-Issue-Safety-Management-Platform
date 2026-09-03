const Joi = require("joi");

const technicianSchema = Joi.object({
  userId: Joi.string().required(),

  name: Joi.string().required(),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .required(),

  departmentId: Joi.string()
    .required(),

  skills: Joi.array()
    .items(Joi.string())
    .default([]),

  availability: Joi.boolean()
    .default(true),

  currentWorkload: Joi.number()
    .min(0)
    .default(0),

  status: Joi.string()
    .valid("active", "inactive")
    .default("active"),
});

const validateTechnician = (req, res, next) => {
  const { error } = technicianSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = validateTechnician;