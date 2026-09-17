const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const safetyService = require("../services/safety.service");

const getPublicSafetyIssues = asyncHandler(async (req, res) => {
  const issues = await safetyService.getPublicSafetyIssues();

  return apiResponse(
    res,
    200,
    "Safety issues fetched successfully",
    issues,
  );
});

module.exports = {
  getPublicSafetyIssues,
};