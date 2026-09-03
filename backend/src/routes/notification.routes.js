const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get(
  "/",
  authMiddleware,
  notificationController.getMyNotifications,
);

router.patch(
  "/read-all",
  authMiddleware,
  notificationController.markAllNotificationsAsRead,
);

router.patch(
  "/:id/read",
  authMiddleware,
  notificationController.markNotificationAsRead,
);

module.exports = router;