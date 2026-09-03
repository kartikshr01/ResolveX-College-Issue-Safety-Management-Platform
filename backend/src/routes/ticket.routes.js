const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validation.middleware");

const {
  createTicketValidator,
  updateTicketValidator,
} = require("../validators/ticket.validator");

const ticketController = require("../controllers/ticket.controller");

const upload = require("../middleware/upload.middleware");

const roleMiddleware = require("../middleware/role.middleware");

// ======================================================
// CREATE TICKET
// ======================================================

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validate(createTicketValidator),
  asyncHandler(ticketController.createTicket),
);

// ======================================================
// USER - MY TICKETS
// ======================================================

router.get("/my", authMiddleware, asyncHandler(ticketController.getMyTickets));

// ======================================================
// TECHNICIAN - ASSIGNED TICKETS
// ======================================================

router.get(
  "/technician/assigned",
  authMiddleware,
  asyncHandler(ticketController.getAssignedTickets),
);

// ======================================================
// TECHNICIAN - HISTORY
// ======================================================

router.get(
  "/technician/history",
  authMiddleware,
  asyncHandler(ticketController.getTechnicianHistory),
);

// ======================================================
// TECHNICIAN - SINGLE TICKET
// ======================================================

router.get(
  "/technician/:ticketId",
  authMiddleware,
  asyncHandler(ticketController.getTechnicianTicketById),
);

// ======================================================
// USER - SINGLE TICKET
// ======================================================

router.get(
  "/my/:ticketId",
  authMiddleware,
  asyncHandler(ticketController.getTicketById),
);

// ======================================================
// ADMIN - SINGLE TICKET
// ======================================================

router.get(
  "/admin/:ticketId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  asyncHandler(ticketController.getTicketById_forAdmin),
);

// ======================================================
// ADMIN - ALL TICKETS
// ======================================================

router.get(
  "/all",
  authMiddleware,
  roleMiddleware("ADMIN"),
  asyncHandler(ticketController.getAllTickets),
);

// ======================================================
// USER - DELETE TICKET
// ======================================================

router.delete(
  "/my/:ticketId",
  authMiddleware,
  asyncHandler(ticketController.deleteTicketById),
);

// ======================================================
// USER - UPDATE TICKET
// ======================================================

router.patch(
  "/:id",
  authMiddleware,
  validate(updateTicketValidator),
  asyncHandler(ticketController.updateTicket),
);

// ======================================================
// TECHNICIAN - UPDATE STATUS
// ======================================================

router.patch(
  "/:ticketId/status",
  authMiddleware,
  asyncHandler(ticketController.updateTicketStatus),
);

// ======================================================
// USER - UPDATE IMAGE
// ======================================================

router.patch(
  "/:id/image",
  authMiddleware,
  upload.single("image"),
  asyncHandler(ticketController.updateTicketImage),
);

module.exports = router;
