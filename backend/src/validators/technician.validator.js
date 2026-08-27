const Joi = require("joi");

const technicianSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .required(),

  departmentId: Joi.string(),

  skills: Joi.array()
    .items(Joi.string()),

  availability: Joi.boolean(),

  currentWorkload: Joi.number()
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