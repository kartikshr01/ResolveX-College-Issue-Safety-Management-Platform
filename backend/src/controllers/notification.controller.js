const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const notificationService = require("../services/notification.service");

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications =
    await notificationService.getMyNotifications(req.user._id);

  return apiResponse(
    res,
    200,
    "Notifications fetched successfully",
    notifications,
  );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification =
    await notificationService.markNotificationAsRead(
      req.params.id,
      req.user._id,
    );

  return apiResponse(
    res,
    200,
    "Notification marked as read",
    notification,
  );
});

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
};