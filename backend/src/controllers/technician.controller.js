const technicianService = require("../services/technician.service");

const asyncHandler = require("../utils/asyncHandler");

const apiResponse = require("../utils/apiResponse");

const apiError = require("../utils/apiError");

// CREATE TECHNICIAN
const createTechnician = asyncHandler(async (req, res) => {
  const technician = await technicianService.createTechnician(
    req.body
  );

  return apiResponse(
    res,
    201,
    "Technician created successfully",
    technician
  );
});

// GET ALL TECHNICIANS
const getTechnicians = asyncHandler(async (req, res) => {
  const technicians = await technicianService.getTechnicians();

  return apiResponse(
    res,
    200,
    "Technicians fetched successfully",
    technicians
  );
});

// GET TECHNICIAN BY ID
const getTechnicianById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const technician =
    await technicianService.getTechnicianById(id);

  if (!technician) {
    throw apiError(404, "Technician not found");
  }

  return apiResponse(
    res,
    200,
    "Technician fetched successfully",
    technician
  );
});

// GET ASSIGNED TICKETS
const getAssignedTickets = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const technician =
    await technicianService.getTechnicianById(id);

  if (!technician) {
    throw apiError(404, "Technician not found");
  }

  const tickets =
    await technicianService.getAssignedTickets(id);

  return apiResponse(
    res,
    200,
    "Assigned tickets fetched successfully",
    tickets
  );
});

// UPDATE TECHNICIAN
const updateTechnician = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const technician =
    await technicianService.updateTechnician(
      id,
      req.body
    );

  if (!technician) {
    throw apiError(404, "Technician not found");
  }

  return apiResponse(
    res,
    200,
    "Technician updated successfully",
    technician
  );
});

// DELETE TECHNICIAN
const deleteTechnician = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const technician =
    await technicianService.deleteTechnician(id);

  if (!technician) {
    throw apiError(404, "Technician not found");
  }

  return apiResponse(
    res,
    200,
    "Technician deleted successfully"
  );
});

// UPDATE AVAILABILITY
const updateAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { availability } = req.body;

  if (typeof availability !== "boolean") {
    throw apiError(
      400,
      "Availability must be true or false"
    );
  }

  const technician =
    await technicianService.updateAvailability(
      id,
      availability
    );

  if (!technician) {
    throw apiError(404, "Technician not found");
  }

  return apiResponse(
    res,
    200,
    "Technician availability updated successfully",
    technician
  );
});

module.exports = {
  createTechnician,
  getTechnicians,
  getTechnicianById,
  getAssignedTickets,
  updateTechnician,
  deleteTechnician,
  updateAvailability,
};