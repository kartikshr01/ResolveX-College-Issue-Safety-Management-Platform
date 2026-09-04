const joi = require("joi");

const createTicketValidator = joi.object({
  title: joi.string().required().trim().min(5).max(150),
  description: joi.string().required().trim().min(10).max(2000),
  departmentId: joi.string().required(),
  category: joi.string().required().trim(),
  location: joi.string().required().trim().max(200),
  priority: joi.string().valid("LOW", "MEDIUM", "HIGH", "CRITICAL").required(),
  safetyFlag: joi.boolean().default(false),
  name: joi.string(),
});

const updateTicketValidator = joi
  .object({
    title: joi.string().trim().min(5).max(150),

    description: joi.string().trim().min(10).max(2000),

    category: joi.string().trim(),

    location: joi.string().trim().max(200),

    priority: joi.string().valid("LOW", "MEDIUM", "HIGH", "CRITICAL"),

    safetyFlag: joi.boolean(),

    departmentId: joi.string(),
    name: joi.string(),
  })
  .min(1);

module.exports = {
  createTicketValidator,
  updateTicketValidator,
};
