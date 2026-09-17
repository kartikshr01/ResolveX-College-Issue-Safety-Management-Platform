const Joi = require("joi");

// Create Technician validation
const createTechnicianSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 50 characters",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Valid email is required",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),

  phone: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .required()
    .messages({
      "number.base": "Phone number must be a number",
      "number.min": "Phone number must be 10 digits",
      "number.max": "Phone number must be 10 digits",
      "any.required": "Phone number is required",
    }),

  departmentId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.length": "Invalid Department ID format",
      "string.hex": "Invalid Department ID format",
      "any.required": "Department ID is required",
    }),

  skills: Joi.array()
    .items(Joi.string().trim())
    .optional()
    .default([]),
});

// Update Technician / Student → Technician validation
const updateTechnicianSchema = Joi.object({
  departmentId: Joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      "string.length": "Invalid Department ID format",
      "string.hex": "Invalid Department ID format",
    }),

  phone: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .optional()
    .messages({
      "number.base": "Phone number must be a number",
      "number.min": "Phone number must be 10 digits",
      "number.max": "Phone number must be 10 digits",
    }),

  skills: Joi.array()
    .items(Joi.string().trim())
    .optional(),

  availability: Joi.boolean()
    .optional(),

  status: Joi.string()
    .valid("active", "inactive")
    .optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });

module.exports = {
  createTechnicianSchema,
  updateTechnicianSchema,
};