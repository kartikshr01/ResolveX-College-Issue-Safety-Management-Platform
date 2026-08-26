const apiError = require("../utils/apiError");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw apiError(401, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw apiError(403, "You are not authorized");
    }

    next();
  };
};

module.exports = roleMiddleware;