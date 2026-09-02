const Technician = require("../models/Technician.model");

// CREATE TECHNICIAN
const createTechnician = async (data) => {
  const technician = await Technician.create(data);
  return technician;
};

// GET ALL TECHNICIANS
const getTechnicians = async () => {
  return await Technician.find();
};

// GET TECHNICIAN BY ID
const getTechnicianById = async (id) => {
  return await Technician.findById(id);
};

// UPDATE TECHNICIAN
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

// DELETE TECHNICIAN
const deleteTechnician = async (id) => {
  return await Technician.findByIdAndDelete(id);
};

// UPDATE AVAILABILITY
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

  // Technician became available
  if (availability === true) {
    const assignmentService = require("./assignment.service");

    await assignmentService.assignPendingTicketsToTechnician(
      technician._id
    );
  }

  return technician;
};

// INCREMENT WORKLOAD
const incrementWorkload = async (technicianId) => {
  return await Technician.findByIdAndUpdate(
    technicianId,
    { $inc: { currentWorkload: 1 } },
    { new: true }
  );
};

// DECREMENT WORKLOAD
const decrementWorkload = async (technicianId) => {
  return await Technician.findByIdAndUpdate(
    technicianId,
    { $inc: { currentWorkload: -1 } },
    { new: true }
  );
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
};