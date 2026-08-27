const Department = require("../models/Department.model");
const Ticket = require("../models/Ticket.model");
const apiError = require("../utils/apiError");
const uploadImage = require("../utils/uploadImage");
const deleteImage = require("../utils/deleteImage");

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
    imagePublicId = result.public_id;
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

// Service : update ticket
const updateTicketById = async (ticketId, userId, updateData) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  });

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  if (ticket.status !== "OPEN") {
    throw apiError(403, "Ticket can only be updated while it is OPEN");
  }

  if (updateData.departmentId) {
    const department = await Department.findById(updateData.departmentId);

    if (!department) {
      throw apiError(404, "Department not found");
    }

    if (!department.active) {
      throw apiError(403, "Department is inactive");
    }
  }

  Object.assign(ticket, updateData);

  await ticket.save();

  return ticket;
};

// Service : update image
const updateTicketImage = async (ticketId, userId, imageFile) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  });

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  if (ticket.status !== "OPEN") {
    throw apiError(403, "Ticket image can only be updated while it is OPEN");
  }

  if (!imageFile) {
    throw apiError(400, "Image is required");
  }
  const oldImagePublicId = ticket.imagePublicId;

  const result = await uploadImage(imageFile.buffer);

  ticket.imageUrl = result.secure_url;
  ticket.imagePublicId = result.public_id;

  await ticket.save();

  if (oldImagePublicId) {
    await deleteImage(oldImagePublicId);
  }

  return ticket;
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  deleteTicketById,
  updateTicketById,
  updateTicketImage,
};
