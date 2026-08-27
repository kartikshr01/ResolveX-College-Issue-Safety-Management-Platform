const Department = require("../models/Department.model");
const Ticket = require("../models/Ticket.model");
const apiError = require("../utils/apiError");
const uploadImage = require("../utils/uploadImage");

//Service : create ticket
const createTicket = async (userId, ticketData, imageFile) => {
  const department = await Department.findById(ticketData.departmentId);
  if (!department) {
    throw apiError(404, "Department not found ");
  }

  if (!department.active) {
    throw apiError(403, "Department is inactive");
  }

  let imageUrl = null;
  if (imageFile) {
    const result = await uploadImage(imageFile.buffer);
    imageUrl = result.secure_url;
  }

  const ticket = await Ticket.create({
    ...ticketData,
    imageUrl,
    userId,
    status: "OPEN",
  });
  return ticket;
};

// Service : get my tickets
const getMyTickets = async (userId) => {
  const tickets = await Ticket.find({ userId })
    .sort({ createdAt: -1 })
    .populate("departmentId", "name");

  if (!tickets) {
    throw apiError(404, "No tickets found ");
  }

  return tickets;
};

// Service : get ticket by id
const getTicketById = async (ticketId, userId) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  }).populate("departmentId", "name");

  return ticket;
};

// Service :  delete ticket
const deleteTicketById = async (ticketId, userId) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  });

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }
  if (ticket.status !== "OPEN") {
    return {
      nonDeletable: true,
      ticket,
    };
  }
  await Ticket.deleteOne({
    _id: ticketId,
    userId,
  });

  return {
    nonDeletable: false,
    ticket,
  };
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  deleteTicketById,
};
