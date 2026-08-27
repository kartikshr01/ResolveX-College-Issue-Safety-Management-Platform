const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validation.middleware");
const { createTicketValidator } = require("../validators/ticket.validator");
const ticketController = require("../controllers/ticket.controller");
const upload = require("../middleware/upload.middleware");

router.post(
  "/",
  authMiddleware,
  upload.single("image") ,  
  validate(createTicketValidator),
  asyncHandler(ticketController.createTicket),
);

router.get("/my", authMiddleware, asyncHandler(ticketController.getMyTickets)); 
router.get("/my/:ticketId" , authMiddleware , asyncHandler(ticketController.getTicketById));
router.delete("/my/:ticketId" ,authMiddleware ,asyncHandler(ticketController.deleteTicketById)); 

module.exports = router;
