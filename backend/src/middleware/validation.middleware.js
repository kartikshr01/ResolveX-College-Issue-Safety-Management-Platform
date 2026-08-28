const apiError = require("../utils/apiError");

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw apiError(
        400,
        error.details.map((detail) => detail.message).join(", "),
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    req.body = value;

    next();
  };
}

module.exports = validationMiddleware;
