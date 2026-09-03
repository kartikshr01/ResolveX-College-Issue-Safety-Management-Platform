const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError'); // Factory function
const adminService = require('../services/admin.service');
const { 
    createTechnicianSchema, 
    updateTechnicianSchema 
} = require('../validators/admin.validator');

// Get system statistics
const getStatistics = asyncHandler(async (req, res) => {
    const stats = await adminService.getSystemStatistics();
    return ApiResponse(res, 200, "Statistics fetched successfully", stats);
});

// Get all technicians
const getTechnicians = asyncHandler(async (req, res) => {
    const technicians = await adminService.getAllTechnicians();
    return ApiResponse(res, 200, "Technicians fetched successfully", technicians);
});

// Create new technician
const createTechnician = asyncHandler(async (req, res) => {
    const { error, value } = createTechnicianSchema.validate(req.body);
    if (error) {
        throw ApiError(400, error.details[0].message); // FIXED: Removed "new"
    }
    
    const newTechnician = await adminService.createTechnician(value);
    return ApiResponse(res, 201, "Technician created successfully", newTechnician);
});

// Update technician / Convert student to technician
const updateTechnician = asyncHandler(async (req, res) => {
    const { error, value } = updateTechnicianSchema.validate(req.body);
    if (error) {
        throw ApiError(400, error.details[0].message); // FIXED: Already matching function call
    }

    const updatedTechnician = await adminService.updateTechnician(req.params.id, value);
    return ApiResponse(res, 200, "Technician updated successfully", updatedTechnician);
});

module.exports = {
    getStatistics,
    getTechnicians,
    createTechnician,
    updateTechnician,
};
