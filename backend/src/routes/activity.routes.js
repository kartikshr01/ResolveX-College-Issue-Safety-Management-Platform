const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// User - get my activities
router.get(
  "/",
  authMiddleware,
  activityController.getMyActivities,
);

// User - get activities of a specific ticket
router.get(
  "/ticket/:ticketId",
  authMiddleware,
  activityController.getTicketActivities,
);

// Admin - get ALL activities
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  activityController.getAllActivities,
);

module.exports = router;