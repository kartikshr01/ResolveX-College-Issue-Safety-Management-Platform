const ticketService = require("../services/ticket.service");
const apiResponse = require("../utils/apiResponse");


const createTicket = async (req, res) => {
  const ticket = await ticketService.createTicket(req.user._id, req.body);
  return apiResponse(res, 201, "Ticket created successfully ", ticket);
};

module.exports = { createTicket };
