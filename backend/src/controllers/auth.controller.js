const authService = require("../services/auth.service");
const apiResponse = require("../utils/apiResponse");

const register = async (req, res) => {
  const user = await authService.register(req.body);

  return apiResponse(
    res,
    201,
    "User registered successfully",
    user
  );
};

module.exports = {
  register,
};