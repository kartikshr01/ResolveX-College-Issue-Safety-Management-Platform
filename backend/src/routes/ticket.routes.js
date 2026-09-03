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

//Route : create ticket
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validate(createTicketValidator),
  asyncHandler(ticketController.createTicket),
);

//Route : get All User Tickets
router.get("/my", authMiddleware, asyncHandler(ticketController.getMyTickets));

//Route : get ticket by id
router.get(
  "/my/:ticketId",
  authMiddleware,
  asyncHandler(ticketController.getTicketById),
); 

//Route : Get Ticket by Id ( admin use only )
router.get(
  "/admin/:ticketId",
  authMiddleware,roleMiddleware("ADMIN") , 
  asyncHandler(ticketController.getTicketById_forAdmin),
);

// Route : Get All Ticket ( admin use only ) 
router.get("/all" , authMiddleware , roleMiddleware("ADMIN") , asyncHandler(ticketController.getAllTickets))


//Route : Delete Ticket 
router.delete(
  "/my/:ticketId",
  authMiddleware,
  asyncHandler(ticketController.deleteTicketById),
);

//Route : update ticket
router.patch(
  "/:id",
  authMiddleware,
  validate(updateTicketValidator),
  asyncHandler(ticketController.updateTicket),
);

//Route : update image in ticket
router.patch(
  "/:id/image",
  authMiddleware,
  upload.single("image"),
  asyncHandler(ticketController.updateTicketImage),
);

router.get(
  "/notification/:ticketId",
  authMiddleware,
  asyncHandler(ticketController.getTicketForNotification),
);

module.exports = router;
