const ticketService = require("../services/ticket.service");
const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");


// CREATE TICKET

const createTicket = async (req, res) => {
  const ticket = await ticketService.createTicket(
    req.user._id,
    req.body,
    req.file,
  );

  return apiResponse(
    res,
    201,
    "Ticket created successfully ",
    ticket,
  );
};


// GET MY TICKETS

const getMyTickets = async (req, res) => {
  const tickets = await ticketService.getMyTickets(req.user);

  return apiResponse(
    res,
    200,
    "Tickets fetched successfully",
    tickets,
  );
};

//Controller - get ticket by id

const getTicketById = async (req, res) => {
  const ticket = await ticketService.getTicketById(
    req.params.ticketId,
    req.user,
  );

  if (!ticket) {
    throw apiError(
      404,
      `Ticket not found for Ticket Id: ${req.params.ticketId}`,
    );
  }

  return apiResponse(res, 200, "Ticket fetched successfully", ticket);
};


// GET TICKET BY ID - TECHNICIAN

const getTechnicianTicketById = async (req, res) => {
  const ticket = await ticketService.getTicketByIdForTechnician(
    req.params.ticketId,
    req.user._id,
  );

  return apiResponse(
    res,
    200,
    "Technician ticket fetched successfully",
    ticket,
  );
};


// GET TICKET BY ID - ADMIN

const getTicketById_forAdmin = async (req, res) => {
  const ticket = await ticketService.getTicketById_forAdmin(
    req.params.ticketId,
  );

  if (!ticket) {
    throw apiError(
      404,
      `Ticket not found for Ticket Id: ${req.params.ticketId}`,
    );
  }

  return apiResponse(res, 200, "Ticket fetched successfully", ticket);
};


// GET ALL TICKETS - ADMIN

const getAllTickets = async (req, res) => {
  const tickets = await ticketService.getAllTickets();

  if (Array.isArray(tickets) && tickets.length === 0) {
    return apiResponse(res, 200, "No tickets found.", null);
  }

  return apiResponse(res, 200, "All tickets fetched successfully", tickets);
};


// DELETE TICKET

const deleteTicketById = async (req, res) => {
  const result = await ticketService.deleteTicketById(
    req.params.ticketId,
    req.user._id,
  );

  if (!result) {
    throw apiError(404, "Ticket not found");
  }

  if (result.nonDeletable) {
    throw apiError(
      403,
      "Ticket cannot be deleted as work has been initiated on it",
    );
  }

  return apiResponse(
    res,
    200,
    "Ticket deleted successfully",
    null,
  );
};


// UPDATE TICKET

const updateTicket = async (req, res) => {
  const ticket = await ticketService.updateTicketById(
    req.params.id,
    req.user._id,
    req.body,
  );

  return apiResponse(
    res,
    200,
    "Ticket updated successfully",
    ticket,
  );
};


// UPDATE TICKET IMAGE

const updateTicketImage = async (req, res) => {
  const ticket = await ticketService.updateTicketImage(
    req.params.id,
    req.user._id,
    req.file,
  );

  return apiResponse(
    res,
    200,
    "Ticket image updated successfully",
    ticket,
  );
};


// Controller - get ticket from notification

const getTicketForNotification = async (req, res) => {
  const ticket =
    await ticketService.getTicketForNotification(
      req.params.ticketId,
      req.user,
    );

  return apiResponse(
    res,
    200,
    "Ticket fetched successfully",
    ticket,
  );
};


// UPDATE TICKET STATUS - TECHNICIAN
 
const updateTicketStatus = async (req, res) => {
  const ticket = await ticketService.updateTicketStatus(
    req.params.ticketId,
    req.user._id,
    req.body.status,
  );

  return apiResponse(
    res,
    200,
    "Ticket status updated successfully",
    ticket,
  );
};
 

// GET ASSIGNED TICKETS - TECHNICIAN

const getAssignedTickets = async (req, res) => {
  const tickets = await ticketService.getAssignedTickets(req.user._id);

  return apiResponse(
    res,
    200,
    "Assigned tickets fetched successfully",
    tickets,
  );
};


// GET TECHNICIAN HISTORY
const getTechnicianHistory = async (req, res) => {
  const tickets = await ticketService.getTechnicianHistory(req.user._id);

  return apiResponse(
    res,
    200,
    "Technician history fetched successfully",
    tickets,
  );
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  getTechnicianTicketById,
  getTicketById_forAdmin,
  getAllTickets,
  deleteTicketById,
  updateTicket,
  updateTicketImage,
  getTicketForNotification,
  updateTicketStatus,
  getAssignedTickets,
  getTechnicianHistory,
};
    