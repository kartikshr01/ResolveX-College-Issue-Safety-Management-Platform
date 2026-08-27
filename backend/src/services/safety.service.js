const Ticket = require("../tickets/ticket.model");

const getPublicSafetyIssues = async () => {
  const issues = await Ticket.find({
    safetyFlag: true,
    status: {
      $in: ["OPEN", "ASSIGNED", "IN_PROGRESS"],
    },
  })
    .select(
      "title description category location priority imageUrl status createdAt updatedAt",
    )
    .sort({ createdAt: -1 })
    .lean();

  return issues;
};

module.exports = {
  getPublicSafetyIssues,
};