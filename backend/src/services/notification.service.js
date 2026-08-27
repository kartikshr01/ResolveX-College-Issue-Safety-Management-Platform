const Notification = require("../models/notification.model");
const apiError = require("../utils/apiError");

const createNotification = async ({
  userId,
  ticketId = null,
  type,
  message,
}) => {
  const notification = await Notification.create({
    userId,
    ticketId,
    type,
    message,
  });

  return notification;
};

const getMyNotifications = async (userId) => {
  const notifications = await Notification.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return notifications;
};

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      userId,
    },
    {
      $set: {
        read: true,
      },
    },
    {
      new: true,
    },
  ).lean();

  if (!notification) {
    throw apiError(404, "Notification not found");
  }

  return notification;
};

module.exports = {
  createNotification,
  getMyNotifications,
  markNotificationAsRead,
};