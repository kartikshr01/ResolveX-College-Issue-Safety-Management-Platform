const Technician = require("../models/Technician.model");
const Ticket = require("../models/Ticket.model");
const apiError = require("../utils/apiError");

const assignTechnician = async (ticketId, departmentId) => {
  // Find the available technician with the lowest workload
  const technician = await Technician.findOne({
    departmentId,
    availability: true,
    status: "active",
  }).sort({
    currentWorkload: 1,
  });

  // No technician available
  if (!technician) {
    return null;
  }

  // Assign technician to ticket
  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    {
      technicianId: technician._id,
      status: "ASSIGNED",
    },
    {
      new: true,
    }
  );

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  // Increase workload
  technician.currentWorkload += 1;

  await technician.save();

  return {
    ticket,
    technician,
  };
};

module.exports = {
  assignTechnician,
};