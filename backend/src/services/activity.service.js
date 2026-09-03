const Activity = require("../models/Activity.model");

const createActivity = async ({
  ticketId,
  actorId,
  action,
  oldStatus = null,
  newStatus = null,
  message,
}) => {
  const activity = await Activity.create({
    ticketId,
    actorId,
    action,
    oldStatus,
    newStatus,
    message,
  });

  return activity;
};

const getMyActivities = async (userId) => {
  const activities = await Activity.find({
    actorId: userId,
  })
    .populate(
      "ticketId",
      "title description category location priority safetyFlag imageUrl imagePublicId status createdAt updatedAt",
    )
    .sort({ createdAt: -1 })
    .lean();

  return activities;
};

const getTicketActivities = async (ticketId) => {
  const activities = await Activity.find({
    ticketId,
  })
    .populate("actorId", "fname lname")
    .sort({ createdAt: 1 })
    .lean();

  return activities;
};

const getAllActivities = async () => {
  const activities = await Activity.find({})
    .populate(
      "ticketId",
      "title description category location priority safetyFlag imageUrl imagePublicId status createdAt updatedAt",
    )
    .populate(
      "actorId",
      "name email role",
    )
    .sort({ createdAt: -1 })
    .lean();

  return activities;
};
module.exports = {
  createActivity,
  getMyActivities,
  getTicketActivities,
  getAllActivities
};