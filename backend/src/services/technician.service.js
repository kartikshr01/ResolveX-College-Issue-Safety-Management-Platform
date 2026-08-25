const Technician = require("../models/Technician.model");

const createTechnician = async (data) => {
  return await Technician.create(data);
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
  return await Technician.findByIdAndUpdate(
    id,
    { availability },
    {
      new: true,
      runValidators: true,
    }
  );
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

module.exports = {
  createTechnician,
  getTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
  updateAvailability,
  incrementWorkload,
  decrementWorkload
 
};