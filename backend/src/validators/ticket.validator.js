const joi = require("joi");

const createTicketValidator = joi.object({
  title: joi.string().required().trim().min(5).max(150),  
  description: joi.string().required().trim().min(10).max(2000),
  departmentId: joi.string().required(),
  category: joi.string().required().trim(),
  location: joi.string().required().trim().max(200),
  priority: joi.string().valid("LOW", "MEDIUM", "HIGH", "CRITICAL").required(),
  safetyFlag: joi.boolean().default(false),
});

module.exports = {
  createTicketValidator,
};
