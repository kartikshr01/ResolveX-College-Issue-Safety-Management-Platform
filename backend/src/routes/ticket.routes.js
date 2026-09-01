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

//Route : Create Ticket
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validate(createTicketValidator),
  asyncHandler(ticketController.createTicket),
);

//Route : get All Tickets of a User
router.get("/my", authMiddleware, asyncHandler(ticketController.getMyTickets));

//Route : Get Ticket by Id
router.get(
  "/my/:ticketId",
  authMiddleware,
  asyncHandler(ticketController.getTicketById),
);

// Route : Get All Ticket ( for admin only ) 
router.get("/all" , authMiddleware , roleMiddleware("ADMIN") , asyncHandler(ticketController.getAllTickets))


//Route : Delete Ticket 
router.delete(
  "/my/:ticketId",
  authMiddleware,
  asyncHandler(ticketController.deleteTicketById),
);

//Route : Update Ticket
router.patch(
  "/:id",
  authMiddleware,
  validate(updateTicketValidator),
  asyncHandler(ticketController.updateTicket),
);

//Route : Update Image in Ticket 
router.patch(
  "/:id/image",
  authMiddleware,
  upload.single("image"),
  asyncHandler(ticketController.updateTicketImage),
);

module.exports = router;
