const assignmentService = require("../services/assignment.service");
const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const assignTechnicianManually = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { technicianId } = req.body;

  const result = await assignmentService.assignTechnicianManually(
    ticketId,
    technicianId
  );

  return apiResponse(
    res,
    200,
    "Technician assigned successfully",
    result
  );
});

module.exports = {
  assignTechnicianManually,
};