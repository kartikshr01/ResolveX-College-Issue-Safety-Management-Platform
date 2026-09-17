const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get(
  "/",
  authMiddleware,
  activityController.getMyActivities,
);

router.get(
  "/ticket/:ticketId",
  authMiddleware,
  activityController.getTicketActivities,
);

module.exports = router;