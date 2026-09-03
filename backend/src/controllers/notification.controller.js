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

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllNotificationsAsRead(
    req.user._id,
  );

  return apiResponse(
    res,
    200,
    "All notifications marked as read",
    null,
  );
});

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};