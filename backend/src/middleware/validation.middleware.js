const apiError = require("../utils/apiError");

const validate = (schema) => {
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
    }

    req.body = value;

    next();
  };
};

module.exports = validate;
