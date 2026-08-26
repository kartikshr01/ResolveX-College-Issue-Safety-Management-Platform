const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validation.middleware");
const { createTicketValidator } = require("../validators/ticket.validator");
const ticketController = require("../controllers/ticket.controller");

router.post(
  "/",
  authMiddleware,
  validate(createTicketValidator),
  asyncHandler(ticketController.createTicket),
);

module.exports = router ; 
