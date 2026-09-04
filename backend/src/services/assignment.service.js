const Technician = require("../models/Technician.model");
const Ticket = require("../models/Ticket.model");
const apiError = require("../utils/apiError");

// Assign a specific technician to a ticket
const assignTechnician = async (ticketId, departmentId) => {
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

  technician.currentWorkload += 1;
  await technician.save();

  return {
    ticket,
    technician,
  };
};


// Automatically assign pending tickets
const assignPendingTicketsToTechnician = async (technicianId) => {
  const technician = await Technician.findById(technicianId);

  if (!technician) {
    throw apiError(404, "Technician not found");
  }

  if (
    technician.availability !== true ||
    technician.status !== "active"
  ) {
    return null;
  }

  // Find oldest/highest-priority pending ticket
  const priorityOrder = {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
  };

  const pendingTickets = await Ticket.find({
    departmentId: technician.departmentId,
    status: "PENDING",
    technicianId: null,
  }).sort({
    createdAt: 1,
  });

  if (pendingTickets.length === 0) {
    return null;
  }

  pendingTickets.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const ticket = pendingTickets[0];

  ticket.technicianId = technician._id;
  ticket.status = "ASSIGNED";

  await ticket.save();

  technician.currentWorkload += 1;
  await technician.save();

  return {
    ticket,
    technician,
  };
};


module.exports = {
  assignTechnician,
  assignPendingTicketsToTechnician,
};