const express = require("express");

const {
  createTechnician,
  getTechnicians,
  getTechnicianById,
  getAssignedTickets,
  updateTechnician,
  deleteTechnician,
  updateAvailability,
} = require("../controllers/technician.controller");

const validateTechnician = require("../validators/technician.validator");

const router = express.Router();

router.post("/", validateTechnician, createTechnician);

router.get("/", getTechnicians);

// ASSIGNED TICKETS
router.get("/:id/tickets", getAssignedTickets);

router.get("/:id", getTechnicianById);

router.put("/:id", updateTechnician);

router.delete("/:id", deleteTechnician);

router.patch("/:id/availability", updateAvailability);

module.exports = router;
