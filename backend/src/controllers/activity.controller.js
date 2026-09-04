const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");
const activityService = require("../services/activity.service");

const getMyActivities = asyncHandler(async (req, res) => {
  const activities = await activityService.getMyActivities(req.user._id);

  return apiResponse(
    res,
    200,
    "Activities fetched successfully",
    activities,
  );
});

const getTicketActivities = asyncHandler(async (req, res) => {
  const activities = await activityService.getTicketActivities(
    req.params.ticketId,
  );

  return apiResponse(
    res,
    200,
    "Ticket activities fetched successfully",
    activities,
  );
});

const getAllActivities = asyncHandler(async (req, res) => {
  const activities = await activityService.getAllActivities();

  return apiResponse(
    res,
    200,
    "All activities fetched successfully",
    activities,
  );
});

module.exports = {
  getMyActivities,
  getTicketActivities,
  getAllActivities
};