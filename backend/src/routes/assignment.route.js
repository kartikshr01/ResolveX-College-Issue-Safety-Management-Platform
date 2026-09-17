const express = require("express");

const {
  assignTechnicianManually,
} = require("../controllers/assignment.controller");

const router = express.Router();

// Admin: Assign technician to a pending ticket
router.patch(
  "/:ticketId",
  assignTechnicianManually
);

module.exports = router;