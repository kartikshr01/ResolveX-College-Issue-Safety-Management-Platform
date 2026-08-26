const Department = require("../models/Department.model");
const Ticket = require("../models/Ticket.model");
const apiError = require("../utils/apiError");

const createTicket = async (userId, ticketData) => {
  const department = await Department.findById(ticketData.departmentId);
  if (!department) {
    throw apiError(404, "Department not found ");
  }

  if (!department.active) {
    throw apiError(403, "Department is inactive");
  }

  const ticket = await Ticket.create({ ...ticketData, userId, status: "OPEN" });
  return ticket;
};

module.exports = {
  createTicket,
};
