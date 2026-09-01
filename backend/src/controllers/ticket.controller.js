const ticketService = require("../services/ticket.service");
const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

//Controller - create ticket
const createTicket = async (req, res) => {
  const ticket = await ticketService.createTicket(
    req.user._id,
    req.body,
    req.file,
  );
  return apiResponse(res, 201, "Ticket created successfully ", ticket);
};

//Controller - get my tickets
const getMyTickets = async (req, res) => {
  const tickets = await ticketService.getMyTickets(req.user._id);

  return apiResponse(res, 200, "Tickets fetched successfully", tickets);
};


//Controller -  get ticket by id
const getTicketById = async (req, res) => {
  const ticket = await ticketService.getTicketById(
    req.params.ticketId,
    req.user._id,
  );
  if (!ticket) {
    throw apiError(
      404,
      null,
      `Ticket not found for Ticket Id : ${req.params.ticketId}`,
    );
  }

  return apiResponse(res, 200, "Ticket fetched successfully", ticket);
};

// Controller - delete ticket by id
const deleteTicketById = async (req, res) => {
  const result = await ticketService.deleteTicketById(req.params.ticketId,req.user._id); 
  
  if(!result){ 
    throw apiError(404 , "Ticket not found");
  } 

  if(result.nonDeletable){ 
    throw apiError(403 ,'Ticket cannot be deleted as work has been initiated on it')
  } 

  return apiResponse(res,200,"Ticket deleted successfully" , null);

};

//Controller : update ticket
const updateTicket = async (req, res) => {
  const ticket = await ticketService.updateTicketById(
    req.params.id,
    req.user._id,
    req.body,
  );

  return apiResponse(res, 200, "Ticket updated successfully", ticket);
};


//Controller : image update in ticket
const updateTicketImage = async (req, res) => {
  const ticket = await ticketService.updateTicketImage(
    req.params.id,
    req.user._id,
    req.file,
  );

  return apiResponse(res, 200, "Ticket image updated successfully", ticket);
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  deleteTicketById,
  updateTicket,
  updateTicketImage,
};
