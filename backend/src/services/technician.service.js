const Technician = require("../models/Technician.model");
const Ticket = require("../models/Ticket.model");

const createTechnician = async (data) => {
  const technician = await Technician.create(data);
  return technician;
};

const getTechnicians = async () => {
  return await Technician.find();
};

const getTechnicianById = async (id) => {
  return await Technician.findById(id);
};

const updateTechnician = async (id, data) => {
  return await Technician.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteTechnician = async (id) => {
  return await Technician.findByIdAndDelete(id);
};

const updateAvailability = async (id, availability) => {
  const technician = await Technician.findByIdAndUpdate(
    id,
    { availability },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!technician) {
    return null;
  }

  if (availability === true) {
    const assignmentService = require("./assignment.service");

    await assignmentService.assignPendingTicketsToTechnician(
      technician._id
    );
  }

  return technician;
};

const incrementWorkload = async (technicianId) => {
  return await Technician.findByIdAndUpdate(
    technicianId,
    { $inc: { currentWorkload: 1 } },
    { new: true }
  );
};

const decrementWorkload = async (technicianId) => {
  return await Technician.findByIdAndUpdate(
    technicianId,
    { $inc: { currentWorkload: -1 } },
    { new: true }
  );
};

// GET ASSIGNED TICKETS
const getAssignedTickets = async (technicianId) => {
  return await Ticket.find({
    technicianId: technicianId,
  })
    .populate("userId", "name email")
    .populate("departmentId", "name")
    .sort({ createdAt: -1 });
};

module.exports = {
  createTechnician,
  getTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
  updateAvailability,
  incrementWorkload,
  decrementWorkload,
  getAssignedTickets,
};